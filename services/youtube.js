'use strict';
const mongoose = require('mongoose');

const YoutubeToken = require(process.cwd()+'/models/YoutubeToken');
const Videos = require(process.cwd()+'/models/Video');

const config = require(process.cwd()+'/config');

const Util = require(process.cwd()+'/util/Util');

const rp = require('request-promise');

const youtube = {
	refreshToken: () => {
		return new Promise (async (resolve,reject) => {
			// Refresh token script
			let googleResponse, updateToken;

			var options = {
			    method: 'POST',
			    uri: config.google.url+'/o/oauth2/token',
			    headers: {
			        'Content-Type': 'application/json',
			        'Accept': 'application/json',
			        'Host': config.google.host
			    },
			    body: {
					"grant_type": config.google.grantType,
					"client_id": config.google.clientId,
					"client_secret": config.google.clientSecret,
					"redirect_uri": config.google.redirectUrl,
					"refresh_token": config.google.refreshToken
				},
			    json: true // Automatically stringifies the body to JSON
			};
			try {
				googleResponse = await rp(options)
					.then(function (parsedBody) {
				        return Promise.resolve(parsedBody)
				    }).catch(function (err) {
				        return err
				    });
				// update Token on DB
				updateToken = await YoutubeToken.findOneAndUpdate(
					{ name: 'youtubeToken'},
					{ $set: {
						token: googleResponse.access_token,
						expiresIn: Date.now() + 3600000	
					}},
					{ "new": true }
				);

			    resolve({
			    	token: updateToken.token,
			    	expiresIn: updateToken.expiresIn
			    })
			} catch(e) {
				reject(e)
			}
		});
	},

	getVideosDetail: (videoIds) => {
		return new Promise(async (resolve, renect) => {
			let googleResponse;

			let idStr = videoIds.join(',');

			/* Get token from DB */
			let token = await YoutubeToken.findOne({ name: 'youtubeToken' });
			/* Check expiry, Refresh if Expired */
			let remaining = (token.expiresIn - Date.now());
			if (remaining < 300000 ) {
				await youtube.refreshToken();
			}
			
			let newToken = await YoutubeToken.findOne({ name: 'youtubeToken' });

			/* Create Request */
			var options = {
			    method: 'GET',
			    uri: `${config.google.api}/youtube/v3/videos?part=contentDetails&id=${idStr}`,
			    headers: {
			        'Authorization': `Bearer ${newToken.token}`,
			        'Accept': 'application/json',
			        'Content-Type': 'application/json'
			    },
			    json: true 
			};

			try {
				googleResponse = await rp(options)
					.then(function (parsedBody) {
				        return Promise.resolve(parsedBody)
				    }).catch(function (err) {
				        return err
				    });
		    	resolve(googleResponse);
			} catch(e) {
				reject(e)
			}
		});
	},

	updateIds: () => {
		return new Promise(async (resolve, reject) => {
			try {
				let videos = await Videos.find();
				videos.forEach(async(video) => {
					if(!video.youtubeId) {
						let youtubeId = video.videoUrl.split('?v=')[1];
						let updateVid = await Videos.findOneAndUpdate(
							{ _id: video._id },
							{ $set: {
								youtubeId: youtubeId
							}},
							{ new: true}
						);
					}
				});
				resolve(true)
			} catch(e) {
				reject(e)
			}
		});
	},

	updateDurations: () => {
		return new Promise(async (resolve, reject) => {
			let videos, ytResponse;
			let ids = [];
			try {
				/* Get Videos without durations */
				videos = await Videos.aggregate([ 
						{ $match: { duration: "" }
					}
				]);
				videos.forEach((vid) => {
					ids.push(vid.youtubeId);
				});

				/* Get video details from Youtube using ids */
				ytResponse = await youtube.getVideosDetail(ids);
				/* Update durations of all records found */
				ytResponse.items.forEach(async (item) => {
					await Videos.findOneAndUpdate(
						{ youtubeId: item.id },
						{ $set: {
							duration: Util.ISO8601(item.contentDetails.duration)
						}},
						{ "new": true }
					);
				});

				resolve(true);
			} catch(e) {
				reject(e);
			}
		});
	}
}

module.exports = youtube
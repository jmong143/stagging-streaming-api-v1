'use strict';
const mongoose = require('mongoose');

const YoutubeToken = require(process.cwd()+'/models/YoutubeToken');
const config = require(process.cwd()+'/config');
const rp = require('request-promise');

const youtube = {
	refreshToken: () => {
		return new Promise (async (resolve,reject)=> {
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
				console.log(googleResponse);
				// update Token on DB
				updateToken = await YoutubeToken.findOneAndUpdate(
					{ name: 'youtubeToken'},
					{ $set: {
						token: googleResponse.access_token,
						expiresIn: Date.now() + 3600000	
					}},
					{ "new": true }
				);
			    // resolve(hrResponse);
			    resolve({
			    	token: updateToken.token,
			    	expiresIn: updateToken.expiresIn
			    })
			} catch(e) {
				reject(e)
			}
		});
	}
}

module.exports = youtube
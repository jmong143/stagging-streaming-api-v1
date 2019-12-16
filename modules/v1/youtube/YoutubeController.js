'use strict';

const rp = require('request-promise');
const mongoose = require('mongoose');
const YoutubeToken = require(process.cwd()+'/models/YoutubeToken');
const youtube = require(process.cwd()+'/services/youtube');
const Auth = require(process.cwd()+'/services/auth');
const Videos = require(process.cwd()+'/models/Video');

const YoutubeController = {
	refreshToken: async (req,res,next)=> {
		// Check if token is expired.
		let token, newToken;

		token = await YoutubeToken.findOne({ name: 'youtubeToken' });
		try {
			// Validate Admin User
			let currentUser = await Auth.getCurrentUser(req);
			await Auth.validateAdminToken(currentUser);

			let remaining = (token.expiresIn - Date.now());
			// Refresh token when remaining time is less than 5 mins.
			// 3000000 ms = 5mins 
			if (remaining < 300000 ) {
				await youtube.refreshToken();
			}
			
			newToken = await YoutubeToken.findOne({ name: 'youtubeToken' });
			res.ok('Successfully get youtube token' ,{
				token: newToken.token,
				generated: newToken.updatedAt,
				expiresIn: newToken.expiresIn,
				remaining: (newToken.expiresIn - Date.now())/60000 +' minutes'
			});
		} catch(e) {
			res.error('failed to refresh token', e.message);
		}
	},

	getDetails: async (req, res, next) => {
		
		let videos, ytResponse;
		let ids = [];
		try {
			let currentUser = await Auth.getCurrentUser(req);
			await Auth.validateAdminToken(currentUser);
			videos = await Videos.find();
			videos.forEach((video) => {
				ids.push(video.videoUrl.split('?v=')[1]);
			});

			ytResponse = await youtube.getVideosDetail(ids);

			res.ok('Successfully get video details from youtube', ytResponse);

		} catch(e) {
			res.error('Failed to get video details.', e.message);
		}
	},

	updatePlaylist: async (req, res, next) => {
		let results = [];
		try {
			let currentUser = await Auth.getCurrentUser(req);
			await Auth.validateAdminToken(currentUser);
			await youtube.updateIds().then((s)=> {
				youtube.updateDurations();
			});
			res.ok('Successfully updated all videos.', {});
		} catch(e) {
			res.error('Failed to update video details', e.message);
		}
	}
}

module.exports = YoutubeController;
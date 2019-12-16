'use strict';

const mongoose = require('mongoose');

const YoutubeToken = require(process.cwd()+'/models/YoutubeToken');

const Youtube = require(process.cwd()+'/services/youtube');
const Config = require(process.cwd()+'/config');
const logger = require(process.cwd()+'/util/logger');

const TAG = '[YOUTUBE]';

const defaults = {
	init: async (app) => {
		/* Youtube Token defaults */
		// Check if Token Exists, if not, create one.
		let token, newToken, saveToken;
		token = await YoutubeToken.findOne({ name: 'youtubeToken' });
		try {
			// If token doesnt exist, create one.
			if(!token) {
				newToken = new YoutubeToken ({
					_id: new mongoose.Types.ObjectId(),
					name: 'youtubeToken',
					token: '1234567890',
					expiresIn: Date.now()
				});

				await newToken.save();
				logger.sys(TAG+'[AUTH]', 'YoutubeToken has been created.');
			} else {
				logger.sys(TAG+'[AUTH]', 'Youtube token exists.');
			}

			/* Update Durations on startup */
			logger.sys(TAG+'[PLAYLIST]', 'Updatng Playlist.')
		 	await Youtube.updateIds().then((result) =>{
				Youtube.updateDurations();
			}).then((result)=>{
				logger.sys(TAG+'[PLAYLIST]', `Playlist Updated.`);
			});

			return ({ youtube: true })
		} catch(e) {
			console.log(e);
			return ({ youtube: false })
		}
	}
};

module.exports = defaults;
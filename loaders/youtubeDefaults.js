const mongoose = require('mongoose');

const YoutubeToken = require(process.cwd()+'/models/YoutubeToken');

const Config = require(process.cwd()+'/config');
const logger = require(process.cwd()+'/util/logger');

const TAG = '[YOUTUBE][DEFAULTS]';

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
				logger.sys(TAG, 'YoutubeToken has been created.');
			} else {
				logger.sys(TAG, 'Youtube token exists.');
			}
			return true
		} catch(e) {
			console.log(e);
			return false
		}
	}
};

module.exports = defaults;
'use strict';

const mongoose = require('mongoose');

const config = require(process.cwd()+'/config');
const logger = require(process.cwd()+'/util/logger');
let TAG = "[DB]";

const dbConfig = {
	init: (app) => {
		// Express Configurations here
		logger.sys(TAG, 'Connecting to database.');
		let uri = ''
		if(config.db.useAtlas) {
			uri = config.db.atlasURI;
			TAG += "[ATLAS]";
		} else {
			uri = config.db.host + config.db.database;
			TAG += "[LOCAL]";
		}
		return new Promise((resolve, reject)=> {
			Promise.all([
				mongoose.set('useNewUrlParser', true),
				mongoose.set('useCreateIndex', true),
				mongoose.set('useUnifiedTopology', true),
				mongoose.set('useFindAndModify', false),
				mongoose.connect(uri)
			]).then((result)=>{
				logger.sys(TAG, 'Connection Successful.')
				resolve({ database : true });
			}).catch((e)=> {
				logger.sys(TAG, 'Failed to Connect.')
				reject(e)
			});
		});
	}
}

module.exports = dbConfig;
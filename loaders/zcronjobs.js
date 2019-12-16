'use strict';

const config = require(process.cwd()+'/config');
const logger = require(process.cwd()+'/util/logger');
const cron = require('node-cron');

const Youtube = require(process.cwd()+'/services/youtube');

let TAG = "[CRON]";

const cronJobs = {
	init: (app) => {
		logger.sys(TAG, `Initializing cron jobs.`);
		cron.schedule(intervals[config.cron.interval].toUpperCase(), () => {
			updatePlaylist();
		});
	}
};

const updatePlaylist = () => {
	return new Promise(async (resolve, reject) => {
		logger.sys(TAG+'[PLAYLIST]', 'Updatng Playlist.');
		await Youtube.updateIds().then((r)=> {
			Youtube.updateDurations;
		}).then((r)	=> {
			logger.sys(TAG+'[PLAYLIST]', `Playlist Updated.`);
			resolve(true);
		}).catch((e) => {
			logger.sys(TAG+'[PLAYLIST]', e.message);
			reject(e)
		});
	});
};

const intervals = {
	'HOURLY': 	"* 59 * * * *",
	'DAILY': 	"* * 23 * * *",
	'WEEKLY': 	"* * * * * 6",
	'MONTHLY': 	"* * * 1 * *"
};

module.exports = cronJobs;
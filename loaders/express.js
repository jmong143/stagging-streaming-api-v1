'use strict';
const config = require(process.cwd()+'/config');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const logger = require(process.cwd()+'/util/logger');
const TAG = "[EXPRESS]";

const expressConfiguration = {
	init: (app) => {
		// Express Configurations here
		logger.sys(TAG, 'Initializing Express configurations.');
		return new Promise((resolve, reject)=> {
			Promise.all([
				app.use(bodyParser.json()),
				app.use(bodyParser.urlencoded({ extended: false })),
				app.use(cookieParser()),
				app.use(cors()),

				// Responses
				app.use(function(req, res, next) {
					res.ok = function(message, body) {
						logger.req(req, "SUCCESS", body);
						res.status(200);
						res.json({
							result: true,
							message: message,
							data: body
						});
					}
					res.error = function(message, error, code) {
						logger.req(req, "ERROR", error);
						if (error =='Unauthorized')
							res.status(401);
						else
							res.status(code || 500);
						
						res.json({
							result: 'failed',
							message: message,
							error: error
						});
					}
					next();
				})

			]).then((result)=>{
				logger.sys(TAG, 'Express configurtions successfully loaded.'),
				resolve({ express: true });
			}).catch((e)=> {
				reject(e)
			});
		});
	}
}

module.exports = expressConfiguration;
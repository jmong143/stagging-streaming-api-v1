'use strict';
const Config = require(process.cwd()+'/config'); 

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require(process.cwd()+'/models/User');

const Auth = {
	validateApp: (req,res,next) => {
		// Env Values
		let _clientid = Config.auth.clients;
		let _clientSecret = Config.auth.secret;

		// User Values
		let clientid = req.headers['x-client-id'] || '';
		let clientsecret = req.headers['x-client-secret'] || '';
		
		try {
			if(!clientid)
				throw new Error('Client Id is missing.');
			if(!clientsecret)
				throw new Error('Client Secret is missing');
			if(_clientid !== clientid)
				throw new Error('Invalid Client Id.');
			if(_clientSecret !== clientsecret)
				throw new Error('Invalid Client Secret');
			next();	
		} catch (e) {
			res.error('Unauthorized', e.message, 401);
		}
	},

	validateToken: (user) => {
		return new Promise((resolve,reject) => {
			if (user.isAdmin === false) {
				resolve (true)		
			} else {
				reject(new Error('Unauthorized'))
			}
		});
	},

	validateAdminToken: (user) => {
		return new Promise((resolve,reject) => {
			if (user.isAdmin === true) {
				resolve (true)		
			} else {
				reject(new Error('Unauthorized'))
			}
		});
	},

	getCurrentUser: async (req) => {

		let token = req.headers['token'];
		if (!token){
			return new Error('Token is required.');
		};
		try {
			const decoded = await jwt.verify(token, Config.auth.secret);
			const user = await User.findOne({ _id: decoded._id });
			if(user) 
				return user
			else 
				throw new Error('Unauthorized');
		} catch (e) {
			return e
		}
	}
}

module.exports = Auth;
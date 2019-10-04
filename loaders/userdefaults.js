const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require(process.cwd()+'/models/User');

const Config = require(process.cwd()+'/config');
const logger = require(process.cwd()+'/util/logger');

const TAG = '[USER][DEFAULTS]';

const defaults = {
	init: async (app) => {
		/* Create Default Admin User*/
		let password = Config.defaultAdminUser.password;
		let email = Config.defaultAdminUser.email;
		let user, saveUser, hash, doExsist;
		doExsist = await User.findOne({ email: email });
		try {
			if(doExsist) 
				throw new Error('Default User already exists.');
			hash = await bcrypt.hash(password, 10);
			user = new User ({
				_id: new mongoose.Types.ObjectId(),
				email: email,
				password: hash,
				firstName: 'Pinnacle',
				lastName: 'Admin',
				deactivatedAt: '',
				isActive: true,
				isAdmin: true
			});

			saveUser = await user.save();
			logger.sys(TAG, 'Default admin user has been created.');
			return true
		} catch(e) {
			logger.sys(TAG, 'Default admin user exists.');
			return false
		}		
	}
};

module.exports = defaults;
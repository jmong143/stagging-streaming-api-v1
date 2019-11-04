'use strict';
/* Dependencies */
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require(process.cwd()+'/config'); 

/* Model */
const User = require(process.cwd()+'/models/User');
const UserProfile = require(process.cwd()+'/models/UserProfile');

/* Services */
const Auth = require(process.cwd()+'/services/auth');
const Mailer = require(process.cwd()+'/services/mailer');

// const ResetPasswordToken = require('../../models/ResetPasswordToken');

const AuthController = {

	login: async (req, res) => {
		let hash, user, token
		let accountExpiriy = config.account.expiry; //In Months
		let expiry = config.token.expiry;
		let clientSecret = req.headers['x-client-secret'];
		try {
			user = await User.findOne({ email: req.body.email }, { __v: 0 });
			if (!user) 
				throw new Error('Username/Password incorrect.');

			// First Time Login account expiry
			if (user.isAdmin == false && !user.expiresAt ) {
				await User.findOneAndUpdate(
					{ _id: user._id },			// Months * 31Days * 24h & 60M * 60S * 1000ms
					{ $set: { expiresAt: new Date(Date.now()+(accountExpiriy*31*24*60*60*1000))}},
					{ new: true }
				);
			}

			let profile = await UserProfile.findOne({ userId: user._id });
			hash = await bcrypt.compare(req.body.password, user.password || '');	
			if (!hash)
				throw new Error('Password is incorrect.')
			token =  await jwt.sign({
				email: user.email,
				_id: user._id
			},
				clientSecret,
			{
				expiresIn: expiry *1000
			});

			res.ok('Login Successful.', { 
				user: user, 
				profile: profile,
				token: token,
				expiresIn: new Date(Date.now()+(expiry*1000)),
				loginTime: new Date(Date.now())
			});
		
		} catch(e) {
			res.error('Failed to login.', e.message, 401);
		}
	},

	changePassword: async (req, res, next) => {
		let currentUser = await Auth.getCurrentUser(req);
		let changePassword, hash;

		try {
			let isMatch = await bcrypt.compare( req.body.password, currentUser.password);
			if(!isMatch)
				throw new Error('Incorrect password.')

			// Hash new PW
			hash = await bcrypt.hash( req.body.newPassword, 10);

			// Change password
			changePassword = await User.findOneAndUpdate(
				{ _id: currentUser._id },
				{ $set: {
					password: hash }},
				{ new: true }
			);

			res.ok('Successfully changed password.', changePassword);
		} catch(e) {
			res.error('Failed to change password', e.message, 400);
		}
	},

	resetPassword: async (req, res,next) => {
		let user, resetPassword, sendEmail;
		try {
			user = await User.findOne({ email: req.body.email });
			let password = Math.random().toString(36).substr(2, 10).toUpperCase();
			let hash = await bcrypt.hash(password ,10);
			resetPassword = await User.findOneAndUpdate(
				{ _id: user._id },
				{ $set: {
					password: hash }},
				{ new: true }
			);
			
			// Send mail
			sendEmail = await Mailer.sendEmail(req.body.email,'Reset Password',
				`<p>Hi ${user.firstName}, You have successfully reset your password. 
				<br>
				<br>Temporary Password: <b>${password}</b>
				<br>
				<br>Please change your password after you log in.</p>`);
		
			res.ok(`Successfully reset password. An email has been sent to ${user.email}`, {});
		} catch(e) {
			res.error('Failed to reset password', e.message, 400);
		}
	},

	validateToken: async (req, res, next) => {
		try{
			let currentUser = await Auth.getCurrentUser(req);
			await Auth.validateToken(currentUser);
			res.ok('Token is Valid', { validation: true });
		} catch(e) {
			res.error('Unauthorized', e.message);
		} 
	},	

	validateAdminToken: async (req, res, next) => {
		try{
			let currentUser = await Auth.getCurrentUser(req);
			await Auth.validateAdminToken(currentUser);
			res.ok('Token is Valid', { validation: true });
		} catch(e) {
			res.error('Unauthorized', e.message);
		} 
	}
}

module.exports = AuthController;
'use strict';

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const User = require(process.cwd()+'/models/User');
const UserProfile = require(process.cwd()+'/models/UserProfile');

const Auth = require(process.cwd()+'/services/auth');
const Mailer = require(process.cwd()+'/services/mailer');

const UserController = {
	getUsers: async (req, res, next)=> {
		let users;
		try {
			// Validate Admin User
			let currentUser = await Auth.getCurrentUser(req);
			await Auth.validateAdminToken(currentUser);
			// Get List of Users
			users = await User.aggregate([
				{
					$lookup: {
						from: 'pluserprofiles',
						localField: '_id',
						foreignField: 'userId',
						as: 'profile'
					}
				},
				{
					$unwind: {
						path: '$profile',
						"preserveNullAndEmptyArrays": true	
					},
				},
				{ 
					$project : 
					{ 
						_id: 1,
						email: 1,
						firstName: 1,
						lastName: 1,
						school: '$profile.school' || '',
						gender: '$profile.gender' || '',
						birthDate: '$profile.birthDate' || '',
						expiresAt: 1,
						deactivatedAt: 1,
						isArchive: 1,
						isActive: 1,
						isAdmin: 1
					} 
				}				 
			]).sort({createdAt: -1});
			res.ok('Successfully get all users', users);
		} catch (e) {
			res.error('Failed to get user list', e.message);
		}
	},

	getUser: async (req, res, next) => {
		let user, profile;	
		try {
			// Validate Admin User
			let currentUser = await Auth.getCurrentUser(req);
			await Auth.validateAdminToken(currentUser);

			user = await User.findOne({ _id: req.params.userId },{ _id: 0, __v: 0 });
			profile = await UserProfile.findOne({ userId: req.params.userId }, {_id: 0, __v: 0});

			res.ok('Successfully get user details.', {user: user, profile: profile});
		} catch(e) {
			res.error('Failed to get user details.', e.message);
		}
	},

	createUser: async (req, res, next) => {
		let saveUser, sendEmail, hash, newUser, user;
		// Check if existing user
		let password = Math.random().toString(36).substr(2, 10).toUpperCase();
		
		user = await User.findOne( { email: req.body.email } );
			
		try {
			// Validate Admin User
			let currentUser = await Auth.getCurrentUser(req);
			await Auth.validateAdminToken(currentUser);

			// If existing User:
			if(user) 
				throw new Error('User already exists.');
			// Hash password
			hash = await bcrypt.hash(password ,10);

			// Create User
			newUser = new User({
				_id: new mongoose.Types.ObjectId(),
				email: req.body.email,
				password: hash,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				isArchive: false,
				isActive: true,
				isAdmin: req.body.isAdmin				
			});

			saveUser = await newUser.save();
			let newBody = {
				email: saveUser.email,
				password: password,
				firstName: saveUser.firstName,
				lastName: saveUser.lastName,
				isAdmin: saveUser.isAdmin
			}
			sendEmail = await Mailer.sendEmail(req.body.email,'Account Registration',
				`<p>Congratulations ${newBody.firstName}! You can now login in Pinnacle Lectures. <br>
				<br>Email: <b>${newBody.email}</b>
				<br>Temporary Password: <b>${newBody.password}</b>
				<br>
				<br>Don't forget to setup your profile and to change your password after you log in.</p>`);
			
			res.ok('New user successfully created', newUser);
		} catch (e) {
			res.error('Failed to create a new user', e.message);
		}
	},

	updateUser: async (req, res, next) => {
		let user, updateUser, updateProfile, hash, profile;
		try {
			// Validate Admin User
			let currentUser = await Auth.getCurrentUser(req);
			await Auth.validateAdminToken(currentUser);

			// Find User
			user = await User.findOne({ _id: req.params.userId });
			profile = await UserProfile.findOne({ userId: req.params.userId });

			let userBody = {
				updatedAt: Date.now()
			};

			req.body.email ? userBody.email = req.body.email : '';
			req.body.firstName ? userBody.firstName = req.body.firstName : '';
			req.body.lastName ? userBody.lastName = req.body.lastName : '';
			req.body.isActive ? userBody.isActive = req.body.isActive : '';
			req.body.hasOwnProperty('isArchive') ? userBody.isArchive = req.body.isArchive : '';

			if(req.body.isActive = false )
				userBody.deactivatedAt = Date.now();
			

			// If Change Password:
			if (req.body.password) {
				hash = await bcrypt.hash(req.body.password,10);
				userBody.password = hash
			}

			let profileBody = {
				updatedAt: Date.now()
			};

			req.body.birthDate ? profileBody.birthDate = req.body.birthDate : '';
			req.body.gender ? profileBody.gender = req.body.gender : '';
			req.body.school ? profileBody.school = req.body.school : '';

			updateUser = await User.findOneAndUpdate(
				{ _id : user._id },
				{ $set: userBody },
				{ new: true }
			);

			// Check if Profile exists
			if (profile) {
				updateProfile = await UserProfile.findOneAndUpdate(
					{ userId: req.params.userId },
					{ $set: profileBody },
					{ new: true}
				);				
			} else {
				profileBody._id = new mongoose.Types.ObjectId();
				profileBody.userId = req.params.userId;
				let newUserProfile = new UserProfile(profileBody);
				updateProfile = await newUserProfile.save();
			}

			let responseBody = {
				_id: updateUser._id,
				email: updateUser.email,
				firstName: updateUser.firstName,
				lastName: updateUser.lastName,
				birthDate: updateProfile.birthDate || '',
				gender: updateProfile.gender || '',
				school: updateProfile.school || '',
				updatedAt: updateUser.updatedAt,
				deactivatedAt: updateUser.deactivatedAt,
				isArchive: updateUser.isArchive,
				isAdmin: updateUser.isAdmin
			};

			res.ok('User details successfully updated.', responseBody);
		} catch (e) {
			res.error('Failed to update user detials.', e.message);
		}
	},

	deleteUser: async (req, res, next) => {
		let user, deleteUser;
		try {
			user = await User.findOne({ _id: req.params.userId });
			deleteUser = await User.findOneAndUpdate(
				{ _id : user._id },
				{ $set: {
					isArchive: true
				}},
				{ new: true })
			res.ok('User successfully archived.', deleteUser);
		} catch(e) {
			res.error('Failed to archive user.', e.message);
		}
	},

	updateUserProfile: async (req, res, next) => {
		let user, profile, updateProfile, action;
		let profileBody = req.body;
		try {
			user = await Auth.getCurrentUser(req);
			profile = await UserProfile.findOne({ userId: user._id });


			// Create new Profile if doesnt exist.
			if(!profile) {
				action = 'created';
				profileBody._id = new mongoose.Types.ObjectId();
				profileBody.userId = user._id;
				let newProfile = new UserProfile(profileBody);
				updateProfile = await newProfile.save();
			} else {
				action = 'updated';
				updateProfile = await UserProfile.findOneAndUpdate(
					{ userId: user._id},
					{ $set: req.body },
					{ new: true }
				);
			}

			res.ok(`Successfully ${action} profile.`, {user: user, profile: updateProfile});

		} catch(e) {
			res.error('Failed to update User Profile', e.message);
		}
	}
};

module.exports = UserController;
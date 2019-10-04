'use strict';

const mongoose = require('mongoose');

const Video = require(process.cwd()+'/models/Video');
const Permission = require(process.cwd()+'/models/Permission');
const User = require(process.cwd()+'/models/User');

const Auth = require(process.cwd()+'/services/auth');

const PermissionController = {
	getPermissions: async (req, res, next) => {
		let permissions;
		let query = {};
		
		// Determine if admin or not. 
		let currentUser = await Auth.getCurrentUser(req);

		// If not admin
		if (currentUser.isAdmin === false) {
			query = { 
				userId: currentUser._id,
				isArchive: false,
				validUntil: { $gte: Date.now()} 
			};
		} 

		try {
			permissions = await Permission.find(query).sort({ createdAt: -1 });
			res.ok('Successfully get permissions.', permissions);
		} catch(e) {
			res.error('Failed to get permissions.', e.message);
		}
	},

	getPermission: async (req, res, next) => {
		let permission, videos;
		try {
			permission = await Permission.findOne({ _id: req.params.permissionId });
			videos = await Video.find({ _id: { $in : permission.videos }});

			permission.videos = videos;
			res.ok('Successfully get permission details', permission);
		} catch(e) {
			res.error('Failed to get permission details', e.message);
		}
	},

	createPermission: async (req, res, next) => {
		let permission, savePermission, user, videos;
		try {
			// Validate Admin User
			let currentUser = await Auth.getCurrentUser(req);
			await Auth.validateAdminToken(currentUser);

			user = await User.findOne({ _id: req.body.userId });
			// videos = await Video.find({ _id: { $in: req.body.videos }});
			permission = new Permission({
				_id: new mongoose.Types.ObjectId(),
				userId: user._id,
				user: {
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email
				},
				// videos: videos,
				videos: req.body.videos,
				createdAt: Date.now(),
				updatedAt: Date.now(),
				validUntil: req.body.validUntil,
				isArchive: false
			});

			savePermission = await permission.save();
			res.ok(`Special video permission for ${user.firstName} ${user.lastName} has been created.`, savePermission);

		} catch(e) {
			res.error('Special permission creation failed.', e.message);
		}
	},
	updatePermission: async (req, res, next) => {
		let permission, updatePermission;
		try {
			// Validate Admin User	
			let currentUser = await Auth.getCurrentUser(req);
			await Auth.validateAdminToken(currentUser);

			permission = await Permission.findOne({ _id: req.params.permissionId });

			req.body.updateAt= Date.now();

			updatePermission = await Permission.findOneAndUpdate(
				{ _id: permission._id },
				{ $set: req.body },
				{ new: true }
			);

			res.ok('Permission Successfully updated.', updatePermission);
		} catch(e) {
			res.error('Failed to update permission', e.message);
		}
	},
	archivePermission: async (req, res, next) => {
		let permission, archivePermission
		try {
			// Validate Admin User	
			let currentUser = await Auth.getCurrentUser(req);
			await Auth.validateAdminToken(currentUser);

			permission = await Permission.findOne({ _id: req.params.permissionId });

			archivePermission = await Permission.findOneAndUpdate(
				{ _id: permission._id },
				{ $set: { isArchive: true }},
				{ new: true}
			);
			res.ok('Permission Successfully archived.', archivePermission);
		} catch (e) {
			res.error('Failed to archive permission.', e.message);
		}
	}
}

module.exports = PermissionController;
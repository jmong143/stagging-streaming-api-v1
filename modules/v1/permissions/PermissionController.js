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
		let dateNow = Date.now();
		// Determine if admin or not. 
		let currentUser = await Auth.getCurrentUser(req);
		let response = [];

		// If not admin
		if (currentUser.isAdmin === false) {
			query = { 
				userId: currentUser._id,
				isArchive: false 
			};
		} 

		try {
			permissions = await Permission.find(query).sort({ createdAt: -1 });
			permissions.forEach((permission)=> {
				permission.isValid = permission.status == 'Approved' && permission.validUntil > Date.now() ? true : false;
			});

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
		let permission, savePermission;
		try {
			// Validate User
			let user = await Auth.getCurrentUser(req);
			console.log(user);
			let video = await Video.findOne({ _id: req.body.videoId });
			await Auth.validateToken(user);

			if (!video) 
				throw new Error ('Video does not exist.');
			// videos = await Video.find({ _id: { $in: req.body.videos }});
			permission = new Permission({
				_id: new mongoose.Types.ObjectId(),
				userId: user._id,
				user: {
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email
				},
				videoId: video._id,
				videoTitle: video.title,
				videoTags: video.tags,
				subject: video.subject || '',
				reason: req.body.reason || '',
				status: 'Pending',
				remarks: '',
				createdAt: Date.now(),
				updatedAt: Date.now(),
				validUntil: '',
				isArchive: false
			});

			savePermission = await permission.save();
			res.ok(`Request for permission has been submitted.`, savePermission);

		} catch(e) {
			res.error('Request for permission failed.', e.message);
		}
	},

	approvePermission: async (req, res, next) => {
		let permission, updatePermission;		
		try {
			let currentUser = await Auth.getCurrentUser(req);
			await Auth.validateAdminToken(currentUser);

			if (req.body.status != 'Approved' && req.body.status != 'Rejected')
				throw new Error('Invalid status. <Rejected, Approved>');

			req.body.validUntil ? '' : req.body.validUntil = new Date(Date.now()+(1000*60*60*24*7));
			permission = await Permission.findOne({ _id: req.body.permissionId });
			updatePermission = await Permission.findOneAndUpdate(
				{ _id: permission._id },
				{ $set: req.body },
				{ new: true }
			);

			res.ok(`Request successfully ${req.body.status}.`, updatePermission);
		} catch(e) {
			res.error('Failed to approve/reject permission request', e.message);
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
'use strict';

const mongoose = require('mongoose');

const Video = require(process.cwd()+'/models/Video');
const Category = require(process.cwd()+'/models/Category');

const Auth = require(process.cwd()+'/services/auth');

const VideoController = {
	
	getAll: async (req, res, next) => {
		let videos;
		try {
			videos = await Video.find().sort({ createdAt: -1 });
			res.ok('Successfully get all videos', videos);
		} catch (e) {
			res.error('Failed to get list of videos', e.message);
		}
	},

	getById: async (req, res, next) => {
		let video;
		try {
			video = await Video.findOne({ _id: req.params.videoId }, {
				__v: 0,
			});
			res.ok('Successfully get video details', video);
		} catch(e) {
			res.error('Failed to get video details', e.message);
		}
	},

	createVideo: async (req, res, next) => {
		let newVideo, category, saveVideo, newCategory, saveCategory;

		category = await Category.findOne({ name: req.body.category });

		try {
			if(!category) {
				newCategory = new Category({
					_id: new mongoose.Types.ObjectId(),
					name: req.body.category,
					createdAt: Date.now()
				});
			
				saveCategory = await newCategory.save();
			}

			// Validate Admin User
			let currentUser = await Auth.getCurrentUser(req);
			await Auth.validateAdminToken(currentUser);

			newVideo = new Video({
				_id: new mongoose.Types.ObjectId(),
				title: req.body.title,
				description: req.body.description,
				category: req.body.category,
				tags: req.body.tags || '',
				videoUrl: req.body.videoUrl,
				createdAt: Date.now(),
				updadtedAt: Date.now(),
				visibleUntil: req.body.visibleUntil,
				// 86400 * 1000 = 1 day
				// visibleUntil:  new Date(Date.now()+(86400*1000*parseInt(req.body.daysVisible))),
				isArchive: false
			});

			saveVideo = await newVideo.save();

			res.ok('Successfully created a new video', saveVideo);
		} catch(e) {
			res.error('Failed to create a new video', e.message);
		}
	},

	updateVideo: async (req, res, next) => {
		let video, updateVideo;
		try {

			// Validate Admin User
			let currentUser = await Auth.getCurrentUser(req);
			await Auth.validateAdminToken(currentUser);

			video = await Video.findOne({ _id: req.params.videoId });
			updateVideo = await Video.findOneAndUpdate(
				{ _id: video._id },
				{ $set: req.body },
				{ new: true}
			);
			res.ok('Video details successfully updated.', updateVideo);
		} catch (e) {
			res.error('Failed to update video details.', e.message);
		}
	},

	archiveVideo: async (req, res, next) => {
		let video, archiveVideo;
		try {

			// Validate Admin User
			let currentUser = await Auth.getCurrentUser(req);
			await Auth.validateAdminToken(currentUser);

			video = await Video.findOne({ _id: req.params.videoId });
			archiveVideo = await Video.findOneAndUpdate(
				{ _id: video._id },
				{ $set: { isArchive: true }},
				{ new: true }
			);
			res.ok('Video successfully archived.', archiveVideo);
		} catch(e) {
			res.error('Failed to archive video', e.message);
		}
	}
}

module.exports = VideoController;
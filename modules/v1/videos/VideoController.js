'use strict';

const mongoose = require('mongoose');

const Video = require(process.cwd()+'/models/Video');
const Subject = require(process.cwd()+'/models/Subject');

const Auth = require(process.cwd()+'/services/auth');

const VideoController = {
	getBySubject: async (req, res, next) => {
		let subject, videos;		
		try {
			// Validate Subject
			subject = await Subject.findOne({ _id: req.params.subjectId });
			if(!subject)
				throw new Error('Subject does not exist.');

			videos = await Video.find({ subjectId: req.params.subjectId },
				{
					__v: 0
				}
			).sort({ createdAt: -1 });

			res.ok(`Successfully get list of videos for ${subject.name}`, videos);
		} catch(e) {
			res.error(`Failed to get list of videos.`, e.message);
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
		let newVideo, subject, saveVideo;

		subject = await Subject.findOne({ _id: req.body.subjectId });

		try {
			if(!subject)
				throw new Error('Subject not found.');

			// Validate Admin User
			let currentUser = await Auth.getCurrentUser(req);
			await Auth.validateAdminToken(currentUser);

			newVideo = new Video({
				_id: new mongoose.Types.ObjectId(),
				subjectId: req.body.subjectId,
				description: req.body.description,
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
				{$set: req.body },
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
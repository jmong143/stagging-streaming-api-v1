'use strict';

const mongoose = require('mongoose');

const Video = require(process.cwd()+'/models/Video');
const Category = require(process.cwd()+'/models/Category');

/* Services */
const PermissionService = require(process.cwd()+'/services/permissions');
const Auth = require(process.cwd()+'/services/auth');

const VideoController = {
	
	getAll: async (req, res, next) => {
		let query = [];
		let videos;
		let dateNow = Date.now();

		req.query.keyword ? query.push({ 
			$match:{ $or: [
                {"subject": {'$regex': req.query.keyword, '$options' : 'i'}},
                {"title":{'$regex': req.query.keyword, '$options' : 'i'}}
		 	]}
		 }): '';
		let videoKeys = Object.keys(Video.schema.tree);

		try {
			videos = await Video.aggregate(query).sort({ createdAt: -1 });
			videos.forEach((video) => {
				video.status = new Date(video.visibleUntil) >= dateNow ? 'visible' : 'expired' 
				/* Fill in missing fields */
				videoKeys.forEach((key) => {
					!video[key] && key != 'id' ? video[key] = '' : ''; 
				});
			});

			res.ok('Successfully get all videos', await PermissionService.apply(videos, req));
		} catch (e) {
			res.error('Failed to get list of videos', e.message);
		}
	},

	getVideosHome: async (req, res, next) => {
		let query = [];
		let videos;
		let response = [];
		let dateNow = Date.now();
		let tmpVid = {};
		let videoKeys = Object.keys(Video.schema.tree);

		req.query.keyword ? query.push({ 
			$match:{ $or: [
                {"subject": {'$regex': req.query.keyword, '$options' : 'i'}},
                {"title":{'$regex': req.query.keyword, '$options' : 'i'}}
		 	]}
		 }): '';

		try {
			videos = await Video.aggregate(query).sort({ createdAt: -1 });

			videos.forEach((video) => {
				video.status = new Date(video.visibleUntil) >= dateNow ? 'visible' : 'expired' 
				/* Fill in missing fields */
				videoKeys.forEach((key) => {
					!video[key] && key != 'id' ? video[key] = '' : ''; 
				});

				/* Categorize Video Based on Dates. */
				let strDate = JSON.stringify(video.createdAt).split('T')[0].replace('"', '');
				!tmpVid[strDate] ? tmpVid[strDate] = [] : '';
				tmpVid[strDate].push(video)
			});

			Object.keys(tmpVid).forEach((key)=> {
				response.push({
					date: key,
					list:tmpVid[key]
				});
			});

			res.ok('Successfully get all videos', await PermissionService.applyMany(response, req));
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

	/* Front get by Id */
	frontGetById: async (req, res, next) => {
		let video = {}, relevantDate, relevantSubject;
		let dateNow = Date.now();
		try {

			let videoKeys = Object.keys(Video.schema.tree);
			video = await Video.findOne({ _id: req.params.videoId });	
			video.status = new Date(video.visibleUntil) >= dateNow ? 'visible' : 'expired';

			videoKeys.forEach((key) => {
				!video[key] && key != 'id' ? video[key] = '' : ''; 
			});

			let floor = new Date(video.createdAt.setUTCHours(0, 0, 0, 0));
			let ceil = new Date(video.createdAt.setUTCHours(23, 59, 59, 999));

			relevantDate = await Video.aggregate([
				{
					$match: { _id: { $ne: video._id } }
				},
				{ 
					$match:{ createdAt: {
						$gte: floor,
						$lte: ceil
					}}
			 	}
			 ]);

			relevantDate.forEach((dateVids)=> {
				videoKeys.forEach((key) => {
					!dateVids[key] && key != 'id' ? dateVids[key] = '' : '';		
					dateVids.status = new Date(dateVids.visibleUntil) >= dateNow ? 'visible' : 'expired'   
				});
			});

			relevantSubject = await Video.aggregate([
				{
					$match: { _id: { $ne: video._id } }
				},
				{ 
					$match: { subject: video.subject }
			 	}
			 ]);

			relevantSubject.forEach((subVids) => {
				videoKeys.forEach((key) => {
					!subVids[key] && key != 'id' ? subVids[key] = '' : '';
					subVids.status = new Date(subVids.visibleUntil) >= dateNow ? 'visible' : 'expired'  
				});
			});

			/* Video */

			res.ok('Successfully get video details', {
				video: await PermissionService.applySingle(video, req),
				relevantByDate: await PermissionService.apply(relevantDate, req),
				relevantBySubject: await PermissionService.apply(relevantSubject, req)
			});
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
				youtubeId: req.body.videoUrl.split('?v=')[1] || '',
				title: req.body.title,
				duration: req.body.duration || '',
				description: req.body.description,
				subject: req.body.subject,
				category: req.body.category,
				tags: req.body.tags || '',
				videoUrl: req.body.videoUrl,
				imageUrl: req.body.imageUrl,
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
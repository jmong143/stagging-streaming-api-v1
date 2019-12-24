'use strict';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const config = require(process.cwd()+'/config'); 
const Auth = require(process.cwd()+'/services/auth');

const Permissions  = require(process.cwd()+'/models/Permission');
const User = require(process.cwd()+'/models/User');

const PermissionService = {
	apply: (videos, req) => {
		return new Promise(async (resolve, reject) => {			
			let user, permission;
			let videoObj = {};

			try {
				user = await Auth.getCurrentUser(req);
				if(user.isAdmin == true)
					resolve(videos);

				permission = await Permissions.aggregate([
					{
						$match: { userId: user._id }
					},
					{
						$match: { status: 'Approved' }
					},
					{ 
						$match: { 
							validUntil: {
								$gte: new Date(Date.now())
							} 
						}
					}
				]);

				permission.forEach((prmsn) => {
					videoObj[prmsn.videoId] ? videoObj[prmsn.videoId] = prmsn.validUntil : videoObj[prmsn.videoId] = prmsn.validUntil; 
				});	

				videos.forEach((video, index) => {
					if(videoObj[video._id.toString()]) {
						videos[index]['status'] = 'visible'; 
						videos[index]['visibleUntil'] = videoObj[video._id];
					}
				});

				resolve(videos);
			} catch(e) {
				reject(e);
			}			 
		});
	},

	applySingle: (video, req) => {
		return new Promise(async (resolve, reject) => {
			let user, permission;
			let videoObj = {};

			try {
				user = await Auth.getCurrentUser(req);
				if(user.isAdmin == true)
					resolve(video);

				permission = await Permissions.aggregate([
					{
						$match: { userId: user._id }
					},
					{
						$match: { status: 'Approved' }
					},
					{ 
						$match: { 
							validUntil: {
								$gte: new Date(Date.now())
							} 
						}
					}
				]);

				permission.forEach((prmsn) => {
					videoObj[prmsn.videoId] ? videoObj[prmsn.videoId] = prmsn.validUntil : videoObj[prmsn.videoId] = prmsn.validUntil; 
				});	

				if(videoObj[video._id.toString()]) {
					video['status'] = 'visible'; 
					video['visibleUntil'] = videoObj[video._id];
				}

				resolve(video);
			} catch(e) {
				reject(e);
			}			 
		});
	},

	applyMany: (arr, req) => {
		return new Promise(async (resolve, reject) => {
			let user, permission;
			let videoObj = {};

			try {
				user = await Auth.getCurrentUser(req);
				if(user.isAdmin == true)
					resolve(arr);
				permission = await Permissions.aggregate([
					{
						$match: { userId: user._id }
					},
					{
						$match: { status: 'Approved' }
					},
					{ 
						$match: { 
							validUntil: {
								$gte: new Date(Date.now())
							} 
						}
					}
				]);

				permission.forEach((prmsn) => {
					videoObj[prmsn.videoId] ? videoObj[prmsn.videoId] = prmsn.validUntil : videoObj[prmsn.videoId] = prmsn.validUntil; 
				});	

				arr.forEach((elem, index) => {
					elem.list.forEach((item, i)=> {
						if(videoObj[item._id]) {
							arr[index].list[i]['status'] = 'visible';
							arr[index].list[i]['visibleUntil'] = videoObj[item._id];
						}
					});
				});

				resolve(arr);
			} catch(e) {
				reject(e);
			}			 
		});
	}
};

module.exports = PermissionService;
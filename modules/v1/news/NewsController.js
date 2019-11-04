'use strict';

const mongoose = require('mongoose');

const News = require(process.cwd()+ '/models/News');

const NewsController = {
	getNews: async (req, res, next) => {
		let news;
		try {
			news = await News.find({isArchive: false}).sort( { updatedAt: -1 } ).limit(9) || [];
			res.ok('Successfully get latest news.', news);
		} catch(e) {
			res.error('Failed to get news', e.message);
		}
	},

	getNewsDetails: async (req, res, next) => {
		let news;
		try {
			news = await News.findOne({ _id: req.params.newsId });
			res.ok('Successfully get news details', news);
		} catch(e) {
			res.error('Failed to get news details', e.message);
		}
	}
};

module.exports = NewsController;

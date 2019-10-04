'use strict';

const mongoose = require('mongoose');

const Video = require(process.cwd()+'/models/Video');
const Category = require(process.cwd()+'/models/Category');

const Auth = require(process.cwd()+'/services/auth');

const CategoryController = {
	getCategories: async (req, res, next) => {
		let categories;
		try {
			categories = await Category.find().sort({ name: -1 });
			res.ok('Successfully get list of categories.', categories);
		} catch(e) {
			res.error('Failed to get list of categories', e.message);
		}
	},

	updateCategory: async (req, res, next) => {
		let category, updateCategory;
		try {
			// Validate Admin User
			let currentUser = await Auth.getCurrentUser(req);
			await Auth.validateAdminToken(currentUser);

			category = await Category.findOne({ _id: req.params.categoryId });
			updateCategory = await Category.findOneAndUpdate(
				{_id: category._id },
				{ $set: req.body },
				{ new: true}
			);

			res.ok('Category successfully updated.', updateCategory);
		} catch(e) {
			res.error('Failed to update category', e.message);
		}
	},

	deleteCategory: async (req, res, next) => {
		let category, deleteCategory;
		try {
			// Validate Admin User
			let currentUser = await Auth.getCurrentUser(req);
			await Auth.validateAdminToken(currentUser);

			category = await Category.findOne({ _id: req.params.categoryId });
			deleteCategory = await Category.findOneAndDelete({ _id: category._id });
			res.ok('Category successfully deleted.', deleteCategory);
		} catch(e) {
			res.error('Failed to delete category', e.message);
		}
	}
};

module.exports = CategoryController;
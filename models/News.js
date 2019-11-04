const mongoose = require('mongoose');

const News = {
	table: 'News',
	key: 'value',
	schema: mongoose.Schema({
		_id: {
			name: 'Id',
			type: mongoose.Schema.Types.ObjectId,
			required: true
		},
		title: { 
			name: 'Title',
			type: String, 
			required: true
		},
		description: { 
			name: 'Description',
			type: String, 
			required: true
		},
		author: {
			name: 'Author',
			type: String,
			default: "" 
		},
		imageUrl: { 
			name: 'ImageUrl',
			type: String, 
			default: "" 
		},
		createdBy: { 
			name: 'CreatedBy',
			type: String, 
			required: true 
		},
		createdAt: {
			name: 'CreatedAt',
			type: Date, 
			default: Date.now 
		},
		updatedAt: {
			name: 'UpdatedAt',
			type: Date, 
			default: Date.now 
		},
		isArchive: {
			name: 'IsArchive', 
			type: Boolean, 
			required: true, 
			default: false 
		}
	})
};


module.exports = mongoose.model(News.table, News.schema);
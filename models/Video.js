const mongoose = require('mongoose');

const Video = {
	table: 'plvideo',
	key: "value", 
	schema: new mongoose.Schema({
		_id: {
			name : 'Id',
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
		category: {
			name: 'Category',
			type: String,
			required: true
		},
		tags: {
			name: 'Tags',
			type: String,
			required: false
		},
		videoUrl: {
			name: 'VideoUrl',
			type: String,
			required: true
		},
		imageUrl: {
			name: 'Thumbnail',
			type: String,
			required: false
		},
		createdAt: {
			name: 'CreatedAt',
			type: Date,
			required: true
		},
		updatedAt: {
			name: 'UpdatedAt',
			type: Date,
			required: false
		},
		visibleUntil: {
			name: 'VisibleUntl',
			type: Date,
			required: true
		},
		isArchive: {
			name: 'IsArchive',
			type: Boolean,
			default: false
		}
	},
	{
	    timestamps: true
	})
}

module.exports = mongoose.model(Video.table, Video.schema);
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
		youtubeId: {
			name : 'YTId',
			type: String,
			required: false
		},
		title: {
			name: 'Title',
			type: String,
			required: true
		},
		duration: {
			name: 'Duration',
			type: String,
			required: false
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
		subject: {
			name: 'Subject',
			type: String,
			required: false
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
		},
		status: {
			name: 'Status',
			type: String,
		}
	},
	{
	    timestamps: false
	})
}

module.exports = mongoose.model(Video.table, Video.schema);
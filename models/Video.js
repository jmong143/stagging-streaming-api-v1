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
		subjectId: {
			name: 'SubjectId',
			type: String,
			required: true
		},
		description: {
			name: 'Description',
			type: String,
			required: true
		},
		videoUrl: {
			name: 'VideoUrl',
			type: String,
			required: true
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
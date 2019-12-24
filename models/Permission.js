const mongoose = require('mongoose');

const Permission = {
	table: 'plpermission',
	key: "value", 
	schema: new mongoose.Schema({
		_id: {
			name : 'Id',
			type: mongoose.Schema.Types.ObjectId,
			required: true
		},
		userId: {
			name: 'UserId',
			type: mongoose.Schema.Types.ObjectId,
			required: true
		},
		user: {
			name: 'UserDetails',
			type: Object,
			required: true
		},
		videoId: {
			name: 'VideoId',
			type: String,
			required: true
		},
		videoTitle: {
			name: 'VideoName',
			type: String,
			required: true
		},
		subject: {
			namë: 'Subject',
			type: String,
			required: false
		},
		reason: {
			name: 'Reason',
			type: String,
			required: true
		},
		status: {
			name: 'Status',
			type: String,
			required: true
		},
		remarks: {
			name: 'Remarks',
			type: String,
			required: false
		},
		createdAt: {
			name: 'CreatedAt',
			type: Date,
			required: true
		},
		isValid: {
			name: 'isValid',
			type: Boolean,
			default: false
		},
		updatedAt: {
			name: 'UpdatedAt',
			type: Date,
			required: false
		},
		validUntil: {
			name: 'ValidUntil',
			type: Date,
			required: false
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

module.exports = mongoose.model(Permission.table, Permission.schema);
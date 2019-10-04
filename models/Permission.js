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
			type: String,
			required: true
		},
		user: {
			name: 'UserDetails',
			type: Object,
			required: true
		},
		videos: {
			name: 'VideoArray',
			type: Array,
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
		validUntil: {
			name: 'ValidUntil',
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

module.exports = mongoose.model(Permission.table, Permission.schema);
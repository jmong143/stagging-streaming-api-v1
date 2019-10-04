const mongoose = require('mongoose');

const User = {
	table: 'pluser',
	key: "value", 
	schema: new mongoose.Schema({
		_id: {
			name : 'Id',
			type: mongoose.Schema.Types.ObjectId,
			required: true
		},
		email: {
			name: 'Email',
			type: String,
			required: true,
			unique: true
		},
		password: {
			name: 'Password',
			type: String,
			required: true
		},
		firstName: {
			name: "FirstName",
			type: String,
			required: true
		},
		lastName: {
			name: "LastName",
			type: String,
			required: true
		},
		deactivatedAt: {
			name: 'DeactivatedAt',
			type: Date,
			required: false,
			default: ''
		},
		isArchive: {
			name: 'IsArchive',
			type: Boolean,
			default: false
		},
		isActive: {
			name: 'Active',
			type: Boolean,
			required: true
		},
		isAdmin: {
			name: 'UserType',
			type: Boolean,
			required: true
		}
	},
	{
	    timestamps: true
	})
}

module.exports = mongoose.model(User.table, User.schema);
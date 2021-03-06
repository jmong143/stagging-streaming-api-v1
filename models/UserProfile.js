const mongoose = require('mongoose');

const User = {
	table: 'pluserprofile',
	key: "value", 
	schema: new mongoose.Schema({
		_id: {
			name : 'Id',
			type: mongoose.Schema.Types.ObjectId,
			required: true
		},
		userId: {
			name: 'userId',
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			unique: true
		},
		school : {
			name: "School",
			type: String
		},
		companyName: {
			name: "Company",
			type: String
		},
		gender: {
			name: "Gender",
			type: String
		},
		birthDate: {
			name: 'BirthDate',
			type: Date
		}
	},
	{
	    timestamps: true
	})
}

module.exports = mongoose.model(User.table, User.schema);
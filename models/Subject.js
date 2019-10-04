const mongoose = require('mongoose');

const Subject = {
	table: 'subject',
	key: 'value',
	schema: new mongoose.Schema({
		_id: {
			name: 'Id',
			type: mongoose.Schema.Types.ObjectId,
			required: true
		},
		code: {
			name: 'Code', 
			type: String, 
			required: true,  
			index: { 
				unique : true, 
				dropDups: true 
			} 
		},
		name: { 
			name: 'SubjecName',
			type: String, 
			required: true,  
			index: { 
				unique : true, 
				dropDups: true 
			} 
		},
		description: {
			name: 'SubjectDescription',
			type: String,
			required: false
		},
		imageUrl: {
			name: 'ImageUrl', 
			type: String, 
			default: "" 
		},
		createdAt: { 
			name: 'CreatedAt',
			type: Date, 
			default: Date.now 
		},
		isArchive: { 
			name: 'IsArchive',
			type: Boolean, 
			default: false 
		}
	},
	{

	})   
};

module.exports = mongoose.model(Subject.table, Subject.schema);
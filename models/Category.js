const mongoose = require('mongoose');

const Category = {
	table: 'plcategory',
	key: 'value',
	schema: new mongoose.Schema({
		_id: {
			name: 'Id',
			type: mongoose.Schema.Types.ObjectId,
			required: true
		},
		name: { 
			name: 'CategoryName',
			type: String, 
			required: true,  
			index: { 
				unique : true, 
				dropDups: true 
			} 
		},
		createdAt: {
			name: 'createdAt',
			type: Date,
			required: true
		}
	},
	{
		timestamps: true
	})   
};

module.exports = mongoose.model(Category.table, Category.schema);
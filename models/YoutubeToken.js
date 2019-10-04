const mongoose = require('mongoose');

const YoutubeToken = {
	table: 'YoutubeToken',
	schema: new mongoose.Schema({
		_id: {
			name : 'Id',
			type: mongoose.Schema.Types.ObjectId,
			required: true
		},
		name: {
			name: 'name',
			type: String,
			require: true,
			default: '',
			unique: true
		},
		token: {
			name: 'AccessToken',
			type: String,
			required: true,
			unique: true
		},
		expiresIn: {
			name: 'Expiry',
			type: Date,
			required: true,
			default: 0
		}
	},
	{
	    timestamps: true
	})
}

module.exports = mongoose.model(YoutubeToken.table, YoutubeToken.schema);
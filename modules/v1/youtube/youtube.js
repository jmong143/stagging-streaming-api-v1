const YoutubeController = require('./YoutubeController');

const router = {
	basePath: '/youtube',
	tags: 'Youtube APIs',
	endpoints: [
		{
			method: 'GET',
			path: '/tokens/refresh',
			description: 'Refresh token - Youtue',
			consumes: ["application/json"],
			produces: ["application/json"],
			handler: YoutubeController.refreshToken
		},
		{
			method: 'GET',
			path: '/videos',
			description: 'Get Video Details from Youtue',
			consumes: ["application/json"],
			produces: ["application/json"],
			handler: YoutubeController.getDetails
		},
		{
			method: 'GET',
			path: '/update',
			description: 'Update playlist',
			consumes: ["application/json"],
			produces: ["application/json"],
			handler: YoutubeController.updatePlaylist
		}
	]
};

module.exports = router;
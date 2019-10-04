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
		}
	]
};

module.exports = router;
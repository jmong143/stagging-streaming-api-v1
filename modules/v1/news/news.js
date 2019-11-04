const NewsController = require('./NewsController');

const router = {
	basePath: '/news',
	tags: 'News APIs',
	endpoints: [
		{
			method: 'GET',
			path: '/',
			description: 'Get all news',
			consumes: ["application/json"],
			produces: ["application/json"],
			handler: NewsController.getNews
		},
		{
			method: 'GET',
			path: '/:newsId',
			description: 'Get news details',
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "News Id",
					required: true,
					in: "path",
					type: "string"
				}
			],
			handler: NewsController.getNewsDetails
		}
	]
};

module.exports = router;
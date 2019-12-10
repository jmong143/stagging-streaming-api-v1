const VideoController = require('./VideoController');

const router = {
	basePath: '/videos',
	tags: 'Video APIs',
	endpoints: [
		{
			method: 'GET',
			path: '/',
			description: 'Get all videos',
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [],	
			handler: VideoController.getAll
		},
		{
			method: 'GET',
			path: '/front/home',
			description: 'Get all videos by date - Front Homepage',
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [],	
			handler: VideoController.getVideosHome
		},
		{
			method: 'GET',
			path: '/:videoId',
			description: 'Get video details',
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "Video Id",
					required: true,
					in: "path",
					type: "string"
				}
			],
			handler: VideoController.getById
		},
		{
			method: 'GET',
			path: '/:videoId/view',
			description: 'Get video details and relevant videos',
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "Video Id",
					required: true,
					in: "path",
					type: "string"
				}
			],
			handler: VideoController.frontGetById
		},
		{
			method: 'POST',
			path: '/',
			description: 'Create new video',
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{	
					name: "Request Body",
					required: true,
					in: "body",
					schema: {
						"$ref": "#/definitions/CreateVideoRequest"
					}
				}
			],
			handler: VideoController.createVideo
		},
		{
			method: 'PUT',
			path: '/:videoId',
			description: 'Update video',
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "Video Id",
					required: true,
					in: "path",
					type: "string"
				},
				{
					name: "Request Body",
					required: true,
					in: "body",
					schema: {
						"$ref": "#/definitions/UpdateVideoRequest"
					}
				}
			],
			handler: VideoController.updateVideo
		},
		{
			method: 'DELETE',
			path: '/:videoId',
			description: 'Archive video',
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "Video Id",
					required: true,
					in: "path",
					type: "string"
				}
			],
			handler: VideoController.archiveVideo
		}
	]
};

module.exports = router;
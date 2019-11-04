const UserController = require('./UserController');

const router = {
	basePath: '/users',
	tags: 'User Management APIs',
	endpoints: [
		{
			method: 'GET',
			path: '/',
			description: 'Get all users',
			consumes: ["application/json"],
			produces: ["application/json"],
			handler: UserController.getUsers
		},
		{
			method: 'GET',
			path: '/:userId',
			description: 'Get user details',
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "User Id",
					required: true,
					in: "path",
					type: "string"
				}
			],
			handler: UserController.getUser
		},
		{
			method: 'POST',
			path: '/',
			description: 'Create new user',
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "Request Body",
					required: true,
					in: "body",
					schema: {
						"$ref": "#/definitions/CreateUserRequest"
					}
				}
			],
			handler: UserController.createUser
		},
		{
			method: 'PUT',
			path: '/:userId',
			description: 'Update User',
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "User Id",
					required: true,
					in: "path",
					type: "string"
				},
				{
					name: "Request Body",
					required: true,
					in: "body",
					schema: {
						"$ref": "#/definitions/UpdateUserRequest"
					}
				}
			],
			handler: UserController.updateUser
		},
		{
			method: 'DELETE',
			path: '/:userId',
			description: 'Archive User',
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "User Id",
					required: true,
					in: "path",
					type: "string"
				}
			],
			handler: UserController.deleteUser
		},
		{
			method: 'POST',
			path: '/profile',
			description: 'Create/Update User profile (Token Based)',
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "Request Body",
					required: true,
					in: "body",
					schema: {
						"$ref": "#/definitions/UpdateUserProfile"
					}
				}
			],
			handler: UserController.updateUserProfile
		}
	]
};

module.exports = router;
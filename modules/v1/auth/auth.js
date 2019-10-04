const AuthController = require('./AuthController');

const router = {
	basePath: '/auth',
	tags: 'Authentication APIs',
	endpoints: [
		{
			method: 'GET',
			path: '/validate',
			description: 'Login',
			consumes: ["application/json"],
			produces: ["application/json"],/* Endpoint Params - Query / Path / Body */
			parameters: [],
			handler: AuthController.validateToken
		},
		{
			method: 'GET',
			path: '/admin/validate',
			description: 'Login',
			consumes: ["application/json"],
			produces: ["application/json"],/* Endpoint Params - Query / Path / Body */
			parameters: [],
			handler: AuthController.validateAdminToken
		},
		{
			method: 'POST',
			path: '/login',
			description: 'Login',
			consumes: ["application/json"],
			produces: ["application/json"],/* Endpoint Params - Query / Path / Body */
			parameters: [
				{
					name: "Request Body",
					required: true,
					in: "body",
					schema: {
						"$ref": "#/definitions/LoginRequest"
					}
				}
			],
			handler: AuthController.login
		},
		{
			method: 'POST',
			path: '/password/change',
			description: 'Change Password',
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "Request Body",
					required: true,
					in: "body",
					schema: {
						"$ref": "#/definitions/ChangePasswordRequest"
					}
				}
			],
			handler: AuthController.changePassword
		},
		{
			method: 'POST',
			path: '/password/reset',
			description: 'Reset Password',
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "Request Body",
					required: true,
					in: "body",
					schema: {
						"$ref": "#/definitions/ResetPasswordRequest"
					}
				}
			],
			handler: AuthController.resetPassword
		}
	]
};

module.exports = router;
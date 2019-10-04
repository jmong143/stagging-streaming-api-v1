const PermissionController = require('./PermissionController');

const router = {
	basePath: '/permissions',
	tags: 'Special Permissions APIs',
	endpoints: [
		{
			method: 'GET',
			path: '/',
			description: 'Get all permissions - Admin / Get Permissions by token - Front',
			consumes: ["application/json"],
			produces: ["application/json"],
			handler: PermissionController.getPermissions
		},
		{
			method: 'GET',
			path: '/:permissionId',
			description: 'Get permission details',
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "Permission Id",
					required: true,
					in: "path",
					type: "string"
				}
			],
			handler: PermissionController.getPermission
		},
		{
			method: 'POST',
			path: '/',
			description: 'Request video viewing permissions',
			consumes: ["application/json"],
			produces: ["application/json"],
				parameters: [
				{
					name: "Request Body",
					required: true,
					in: "body",
					schema: {
						"$ref": "#/definitions/CreatePermissionRequest"
					}
				}
			],
			handler: PermissionController.createPermission
		},
		{
			method: 'POST',
			path: '/approval',
			description: 'Approval of permission requests',
			consumes: ["application/json"],
			produces: ["application/json"],
				parameters: [
				{
					name: "Request Body",
					required: true,
					in: "body",
					schema: {
						"$ref": "#/definitions/PermissionApproval"
					}
				}
			],
			handler: PermissionController.approvePermission
		},
		{
			method: 'PUT',
			path: '/:permissionId',
			description: 'Update permission',
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "Permission Id",
					required: true,
					in: "path",
					type: "string"
				},
				{
					name: "Request Body",
					required: true,
					in: "body",
					schema: {
						"$ref": "#/definitions/UpdatePermissionRequest"
					}
				}
			],
			handler: PermissionController.updatePermission
		},
		{
			method: 'DELETE',
			path: '/:permissionId',
			description: 'Archive permission',
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "Permission Id",
					required: true,
					in: "path",
					type: "string"
				}
			],
			handler: PermissionController.archivePermission
		}
	]
};

module.exports = router;
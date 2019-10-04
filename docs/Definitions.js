/* Request Body Schemas for Documentation */
/* Keys must be unique */

const Definitions = {
	LoginRequest: {
		"email":"<email>",
		"password": "<password>"
	},

	ChangePasswordRequest: {
		"password": "<Current Password>",
		"newPassword": "<New Password>"
	},

	ResetPasswordRequest: {
		"email": "<email>"
	},

	CreatePermissionRequest: {
		"userId":"5d96dc2c6da3ce23240a6c93",
		"videos": [
			"5d96dad050370b13d02521a1",
			"5d95ac891db52e0338c149ca"
		],
		"validUntil": "2019-10-12T05:44:12.873Z"
		
	},
	
	UpdatePermissionRequest: {
		"userId":"5d96dc2c6da3ce23240a6c93",
		"videos": [
			"5d96dad050370b13d02521a1"
		],
		"validUntil": "2019-10-20T05:44:12.873Z",
		"isArchive": false
	},

	CreateUserRequest: {
		"email": "jbulawan@unionbankph.com",
		"firstName": "Jake",
		"lastName": "Bulawan",
		"isAdmin": false
	},

	UpdateUserRequest: {
		"isArchive": false,
	    "email": "bulawanjp@gmail.com",
	    "password": "<password>",
	    "firstName": "Jeyk",
	    "lastName": "Bulawan",
	    "isActive": true,
	    "isAdmin": true,
		"birthDate": "1992-10-07T03:37:33.206Z",
	    "gender": "Male",
	    "school": "Don Bosco Technical College"
	},

	CreateVideoRequest: {
		"subjectId":"5d8e636070edb900172dd136",
		"description": "Sample Video 619",
		"videoUrl": "https://www.youtube.com/zzsWsd1xC",
		"visibleUntil": "2019-10-20T08:08:41.054Z"
	},

	UpdateVideoRequest: {
		"isArchive": false,
		"subjectId": "5d8e636070edb900172dd136",
		"description": "Sample Video 5",
		"videoUrl": "https://www.youtube.com/14Wzda32222s",
		"visibleUntil": "2019-10-10T08:08:41.054Z"
	},

	"500": {
	    "result": "failed",
	    "message": "<Error Message>",
	    "error": "<Error Details>"
	},

	"400": {
	    "result": "failed",
	    "message": "<Error Message>",
	    "error": "<Error details>"
	},

	"401": {
	    "result": "failed",
	    "message": "<Error Message>",
	    "error": "Unauthorized"
	},

	"200": {
	    "result": true,
	    "message": "<Success Message>",
	    "data": "{} or []"
	}
}

module.exports = Definitions;
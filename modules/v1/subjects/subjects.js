const SubjectController = require('./SubjectController');

const router = {
	basePath: '/subjects',
	tags: 'Subject APIs',
	endpoints: [
		{
			method: 'GET',
			path: '/',
			description: 'Get all subjects',
			consumes: ["application/json"],
			produces: ["application/json"],
			handler: SubjectController.getSubjects
		},
		{
			method: 'GET',
			path: '/:subjectId',
			description: 'Get subject details',
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "Subject Id",
					required: true,
					in: "path",
					type: "string"
				}
			],
			handler: SubjectController.getSubject
		}
	]
};

module.exports = router;
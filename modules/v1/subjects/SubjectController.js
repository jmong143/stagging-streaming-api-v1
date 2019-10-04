'use strict';

const Subject = require(process.cwd()+'/models/Subject');

const SubjectController = {
	getSubjects: async (req, res, next) => {
		let subjects;
		try {
			subjects = await Subject.find({},{
				__v: 0,
				description: 0,
				createdAt: 0
			});
			res.ok('Successfully get list of subjects', subjects);
		} catch(e) {
			res.error('Failed to get list of subjects.', e.message);
		}
	},
	getSubject: async (req, res, next) => {
		let subject;
		try {
			subject = await Subject.find({ _id: req.params.subjectId }, {
				__v: 0
			});
			res.ok('Successfully get subject details.', subject);
		} catch(e) {
			res.error('Failed to get subject details.', e.message);
		}
	}
};

module.exports = SubjectController;
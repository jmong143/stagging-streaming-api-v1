const CategoryController = require('./CategoryController');

const router = {
	basePath: '/categories',
	tags: 'Video Categories APIs',
	endpoints: [
		/* Video Category Endpoints */
		{
			method: 'GET',
			path: '/	',
			description: 'Get all video categories',
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [],	
			handler: CategoryController.getCategories
		},
		{
			method: 'PUT',
			path: '/:categoryId',
			description: 'Update category',
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "Category Id",
					required: true,
					in: "path",
					type: "string"
				}
			],	
			handler: CategoryController.updateCategory
		},
		{
			method: 'DELETE',
			path: '/:categoryId',
			description: 'Get all video categories',
			consumes: ["application/json"],
			produces: ["application/json"],
			parameters: [
				{
					name: "Category Id",
					required: true,
					in: "path",
					type: "string"
				}
			],
			handler: CategoryController.deleteCategory
		},
	]
};

module.exports = router;
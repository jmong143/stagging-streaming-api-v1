/* Router */
'use strict';
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const config = require(process.cwd()+'/config');

const logger = require(process.cwd()+'/util/logger');
const Swagger = require(process.cwd()+'/util/Swagger');

const Auth = require(process.cwd()+'/services/auth');
const TAG = "[ROUTER]";

const loader = {
	init: (app) => {
		return new Promise((resolve, reject) => {
			var paths = {};
			try {
				// Get Version
				fs.readdirSync('./modules/').forEach((version)=> {
					if(version.toUpperCase() !== 'INDEX.JS' && version.toUpperCase() !== 'CONTROLLERS'){
						// Get Router files
						fs.readdirSync('./modules/'+version+'/').forEach((module) => {
							// Register Route Here
							// Get Router File {version}/{module}/{router}.js
							let _router = './'+version+'/'+module+'/'+module.replace('.js', '');
							// Register Route
							let router = require(_router);
							
							paths[`/${version}/${module}`] = loader.registerRoute(app, router, version, module);
						});	
					}
				});

				// Api Documentation - Swagger
				let swaggerDocument = Swagger.generateDocs(paths);
				app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
				
				app.get('/swagger', (req,res,next)=> {
					res.status(200).json(swaggerDocument);
				});
	
				// Handle non existing endpoints
				app.use('*', (req, res, next) => {
					let message = "Endpoint doesnt exist.";
					let error = new Error('Not Found');
					res.error(message, error.message);	
				});

				resolve({ routes: true });
			} catch (e) {
				reject(e);
			}
		});
	},

	registerRoute: (app, router, version, module) =>{
		let basePath = '/'+version+router.basePath;
		let list = [];
		try {
			router.endpoints.forEach((endpoint) => {
				try {
					// with ValidateAPP
					app[endpoint.method.toLowerCase()](basePath+endpoint.path, Auth.validateApp ,endpoint.handler);	
					// endpoint.version = version;
					// endpoint.module = module;
					if(endpoint.path === '/')
						endpoint.path = '';
					endpoint.handler = '';
					endpoint.tags = router.tags;
					logger.sys(TAG+`[${module.toUpperCase()}]`, 'Endpoint registered: '+endpoint.method.toUpperCase()+' '+basePath+endpoint.path);
					list.push(endpoint);
				} catch (e) {
					logger.sys(TAG, 'ERROR Creating Routes: '+endpoint.method.toUpperCase()+' '+basePath+endpoint.path+' \n'+ e.message);
				}
			});
		} catch (e) {
			throw Error(e);
		}
		return list
	}
};

module.exports = loader;
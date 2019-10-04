'use strict';

const config = require(process.cwd()+'/config'); 

const generateSchema = require('generate-schema');
const Definitions = require('../docs/Definitions');

const Swagger = {
	generateDocs: (paths) => {
		let appName = process.env.APP_NAME || '[App]';
		let newPaths = {};

		for(var path in paths) {
			paths[path].forEach((endpoint)=>{
				let tmp = {
					tags: [],
					summary: endpoint.description || '',
					consumes: endpoint.consumes || [],
					produces: endpoint.produces || [],
					parameters: endpoint.parameters || {},
					responses: {
						"200": {
							"description": "Successful Response",
		                    "type": "object",
							"schema": {
								"$ref": "#/definitions/200"
							}
						},
						"401": {
							"description": "Unauthorized",
							"type": "object",
							"schema": {
								"$ref": "#/definitions/401"
							}
						},
						"400": {
							"description": "Bad Request",
							"type": "object",
							"schema": {
								"$ref": "#/definitions/400"
							}
						},
						"500": {
							"description": "Internal Server Error",
							"type": "object",
							"schema": {
								"$ref": "#/definitions/500"
							}
						}
					} || {}
				};
				tmp.tags.push(endpoint.tags);
				if(!newPaths[`${path}${endpoint.path}`])
					newPaths[`${path}${endpoint.path}`] = {};
				newPaths[`${path}${endpoint.path}`][endpoint.method.toLowerCase()] = tmp;
			});
		}

		// Generate definitions
		let definitions = Swagger.generateDefinitions(Definitions);

		let swaggerDocument = {
			"swagger": "2.0",
	    	"info": {
		        "description": config.server.appname,
		        "version": config.server.version,
		        "title": config.server.appname+ ' API'
	    	},
		    "host": "",
		    "basePath": config.server.host+':'+config.server.port || "",
		    "schemes": [
		        "http"
		    ],
		    "paths": newPaths,
		    "definitions": definitions
		};

		return swaggerDocument  	
	},

	generateDefinitions: (definitions) => {
		// console.log(definitions);
		let newDefinitions = {};

		for(var definition in definitions) {
			newDefinitions[definition] = Swagger.getProperties(definitions[definition]);
			newDefinitions[definition]['example'] = definitions[definition];
		}

		return newDefinitions;
	},

	getProperties: (element) => {
		return generateSchema.json(element);
	}
}	

module.exports = Swagger;
'use strict'
const config = require(process.cwd()+'/config');
const logger = require(process.cwd()+'/util/logger');
const TAG = "[API]";

var express = require('express');
var app = express();
const fs = require('fs');

var loader = require('./loaders');
var router = require('./modules');

Promise.all(
	[
		loader.init(app),
		router.init(app)
	]).then((result)=>{
	app.listen(config.server.port, ()=> {
		logger.sys(TAG, `Loaders: ${JSON.stringify(Object.assign({}, ...result))}`)
		logger.sys(TAG, `Listening on port ${config.server.port}`);
	});
});
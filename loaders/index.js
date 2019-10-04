'use strict';

const fs = require('fs');

let loader = {
	init: (app) => {
		return new Promise((resolve, reject)=> {
			var tmp = {};
			var loaders = [];
			fs.readdirSync('./loaders/').forEach((file)=> {
				// Skip self init				
				if (file.toUpperCase() !== 'INDEX.JS') {
					let _loader = file.replace('.js', '');
					tmp[_loader] = require('../loaders/'+_loader);
					loaders.push(tmp[_loader].init(app));
				}
			});

			Promise.all((loaders)).then((result)=>{
				resolve(Object.assign({}, ...result));
			}).catch((e)=>{
				reject(e)
			});
		});
	}
}

module.exports = loader;
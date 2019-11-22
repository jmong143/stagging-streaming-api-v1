const Chalk = require('chalk');

const colors = {
	POST: Chalk.greenBright('POST'),
	GET: Chalk.blueBright('GET'),
	PUT: Chalk.redBright('PUT'),
	DELETE: Chalk.magentaBright('DELETE'),
	ERROR: Chalk.redBright("[ERROR]"),
	SUCCESS: Chalk.greenBright("[SUCCESS]")
};

const Logger = {
	sys: (tag, message) => {
		console.log(
			Chalk.whiteBright('['+getDate()+']')+
			Chalk.cyan('[SYSTEM]') +
			Chalk.yellow(tag)
			+': '+message
		);
	},

	req: (req, result, obj) => {
		if(typeof obj === 'object' && !Array.isArray(obj)) {
			obj = JSON.stringify(obj);
		} else if (Array.isArray(obj)) {
			obj = JSON.stringify({ length: obj.length });
		}
		
		let _method = colors[req.method];
		console.log(
			Chalk.whiteBright('['+ getDate() + ']')+
			Chalk.cyan('[REQUEST]: ') +
			_method +' '+
			Chalk.green(req.url) + ' - '+
			colors[result]+
			Chalk.cyanBright(req.headers['x-forwarded-for'] || req.connection.remoteAddress) + 
			': '+obj
		);
	},
}

function getDate () {
	let d = new Date().toString();
	let spl = d.split('GMT');
	return spl[0].substr(0, spl[0].length-1)
}

module.exports = Logger;
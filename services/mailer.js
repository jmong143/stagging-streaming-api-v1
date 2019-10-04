'use strict';

const config = require(process.cwd()+'/config');
const nodemailer = require('nodemailer');

const mailer = {
	sendEmail: (to, subject, content) => {
		return new Promise (async (resolve,reject)=> {
			let sendMail;
			try {
				let transporter = nodemailer.createTransport({
				    host: config.mail.host,
				    secureConnection: config.mail.secureConnection,
				    port: config.mail.port,
				    auth: {
				        user: config.mail.auth.user,
				        pass: config.mail.auth.password
				    }
				});
				let mailOptions = {
					from: `Pinnacle Lectures <${config.mail.auth.user}>`,  
					to: to,
					subject: subject,
					html: content
				};

				sendMail = await transporter.sendMail(mailOptions)
				if(sendMail) {
					resolve(true)
				} else {
					throw new Error('Email sending failed.')
				}
			} catch (e) {
				reject(e)
			}
		});
	}
}

module.exports = mailer
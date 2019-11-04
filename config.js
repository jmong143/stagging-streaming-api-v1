require('dotenv').config();

const Config = {
	server: {
		port: process.env.PORT,
		appname: process.env.APP_NAME,
		host: process.env.HOST,
		version: process.env.VERSION
	},
	auth:{
		clients: process.env.CLIENT_ID,
		secret: process.env.CLIENT_SECRET
	},
	db: {
		host: process.env.DB_HOST,
		database: process.env.DB_DATABASE,
		username: process.env.DB_USER,
		password: process.env.DB_PASS,
		port: process.env.DB_PORT,
		atlasURI: process.env.DB_ATLAS_URI,
		useAtlas: process.env.DB_USE_ATLAS
	},
	mail: {
		host: process.env.MAIL_SERVICE,
		port: process.env.MAIL_PORT,
		secureConnection: process.env.MAIL_SECURE_CONNECTION,
		auth: {
			user: process.env.MAIL_USER,
			password: process.env.MAIL_PASSWORD
		}
	},
	google: {
		host: process.env.GOOGLE_HOST,
		url: process.env.GOOGLE_ACCOUNTS_URL,
		clientId: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		grantType: process.env.GOOGLE_GRANT_TYPE,
		redirectUrl: process.env.GOOGLE_REDIRECT_URL,
		refreshToken: process.env.GOOGLE_REFRESH_TOKEN
	},
	defaultAdminUser: {
		email: process.env.DEFAULT_ADMIN_USER,
		password: process.env.DEFAULT_ADMIN_PASSWORD
	},
	pagination: {
		defaultItemsPerPage: process.env.PAGNINATION_DEFAULT_ITEMS_PER_PAGE
	},
	token: {
		expiry: process.env.TOKEN_EXPIRY
	},
	account: {
		expiry: process.env.ACCOUNTS_EXPIRY
	}
}

module.exports = Config;
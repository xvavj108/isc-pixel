module.exports = {
	port: 8050,
	static: __dirname + '/static',
	storage: {
		path: __dirname + '/data',
	},
	canvas: {
		width: 512,
		height: 512,
	},
	sequelize: {
		database: 'database',
		dialect: 'sqlite',
		username: 'root',
		password: '',
		storage: 'database.db',
	},
	kaptcha: {
		font1path: __dirname + '/static/fonts/kaptcha.fnt',
		font2path: __dirname + '/static/fonts/kaptcha.fnt',
	},
}
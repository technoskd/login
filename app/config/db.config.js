module.exports = {
	HOST: process.env.DBHOST,
	USER: process.env.DBUSER,
	PASSWORD: process.env.DBPASSWORD,
	DB: process.env.DB,
	dialect: 'mysql',
	pool: {
		max: 5,
		min: 0,
		idle: 10000,
	},
};
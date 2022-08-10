var router = require('express').Router();
const auth = require('../controllers/auth')

module.exports = app => {
	router.post('/register', auth.create)
	router.post('/login', auth.login);
	router.post('/forgotpassword', auth.forgotPassword);
	router.post('/forgotpassword/verify', auth.forgotPasswordVerify);
	
	router.get('/me', auth.me);
	
	app.use('/', router);
};



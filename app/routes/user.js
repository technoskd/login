var router = require('express').Router();
const users = require('../controllers/user');

module.exports = app => {
  router.get('/', users.findAll);
  router.get('/:id', users.findOne);
  router.put('/:id', users.update);
  router.delete('/:id', users.delete);

  app.use('/users', router);
};
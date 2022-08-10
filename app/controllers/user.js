'use strict';
const { User, Watch_list, Wallet, Order } = require('../models/index');

const { handleError, getPagination, getPagingResults, handleFilteraAndQuery } = require('../utils/helper');

exports.findAll = (req, res) => {
  const { page, size, sort } = req.query
  const { limit, offset } = getPagination(page, size);
  
  const fields = ['full_name', 'email', 'mobile'];
  const q = handleFilteraAndQuery(req, fields);

  User.findAndCountAll({
    include: [{ model: Watch_list }, { model: Wallet }, { model: Order }],
    where: q,
    order: [[sort ? sort : 'created_at', 'DESC']],
    attributes: { exclude: ['password'] },
    limit, offset
  })
    .then(data => {
      res.send(getPagingResults(data, page, limit));
    })
    .catch(err => {
      handleError(err, req, res);
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      handleError(err, req, res);
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, { where: { id: id } })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Updated successfully.'
        });
      } else {
        res.status(400).send({
          message: `There is something went wrong in updating with id=${id}.`
        });
      }
    })
    .catch(err => {
      handleError(err, req, res);
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "deleted successfully!"
        });
      }
      else {
        res.status(400).send({
          message: `Cannot delete id=${id}`
        });
      }
    })
    .catch(err => {
      handleError(err, req, res);
    });
};
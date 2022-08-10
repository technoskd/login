'use strict';
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('user', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    full_name: {
      type: Sequelize.STRING,
      isAlpha: true,
    },
    mobile: {
      type: Sequelize.UUID,
      unique: true,
      validate: {
        len: {
          args: [10, 13],
        },
        isNumeric: true,
      },
    },
    email: {
      type: Sequelize.STRING,
      validator: {
        isEmail: true,
        unique: true,
      }
    },
    address: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING,
      required: true
    },
    token: {
      type: Sequelize.STRING,
      validate: {
        len: {
          args: [6, 6],
        },
        isNumeric: true,
      }
    },
  },
    {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return User;
};

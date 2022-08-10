'use strict';

module.exports = (sequelize, Sequelize) => {
  const Session = sequelize.define('session', {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: Sequelize.STRING,
    },
    token: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    device: {
      type: Sequelize.TEXT('long'),
    },
  },
    {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  )

  return Session;
}

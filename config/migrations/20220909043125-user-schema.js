import logger from 'winston'

export default {
  up (queryInterface, Sequelize) {
    return queryInterface
      .createTable('Users', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.INTEGER,
          autoIncrement: true,
        },
        firstname: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        lastname: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          isEmail: true,
          unique: true
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      })
      .catch((error) => logger.error(error))
  },

  down (queryInterface) {
    return queryInterface
      .dropTable('Users')
      .catch((error) => logger.error(error))
  },
}

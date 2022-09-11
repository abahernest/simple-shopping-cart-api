import logger from 'winston'

export default {
  up (queryInterface, Sequelize) {
    return queryInterface
      .createTable('Products', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.INTEGER,
          autoIncrement: true,
        },
        amount: {
          type: Sequelize.DOUBLE,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        description: {
          type: Sequelize.STRING,
          defaultValue: '',
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
      .dropTable('Products')
      .catch((error) => logger.error(error))
  },
}

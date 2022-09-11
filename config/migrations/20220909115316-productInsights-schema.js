import logger from 'winston'

export default {
  up (queryInterface, Sequelize) {
    return queryInterface
      .createTable('ProductInsights', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        productId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: 'Products',
            key: 'id',
          },
          unique: true
        },
        timesPurchased: {
          defaultValue: 0,
          type: Sequelize.INTEGER,
        },
        timesRemovedFromBasket: {
          defaultValue: 0,
          type: Sequelize.INTEGER,
        },
        timesAddedToBasket: {
          defaultValue: 0,
          type: Sequelize.INTEGER,
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
      .dropTable('ProductInsights')
      .catch((error) => logger.error(error))
  },
}

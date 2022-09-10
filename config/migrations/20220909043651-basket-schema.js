import logger from 'winston'

export default {
  up (queryInterface, Sequelize) {
    return queryInterface
      .createTable('Baskets', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        userId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id',
          },
        },
        productId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: 'Products',
            key: 'id',
          },
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
      .dropTable('Baskets')
      .catch((error) => logger.error(error))
  },
}

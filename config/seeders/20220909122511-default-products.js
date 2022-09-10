import logger from 'winston'
import demoProducts from '../products.json'
const products = []
const now = new Date()

demoProducts.forEach((product) => {
  products.push({
    name: product.name,
    createdAt: now,
    updatedAt: now,
    amount: product.price
  })
})

export default {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'Products',
      products
    ).catch(error => logger.error(error))
  },

  down (queryInterface, Sequelize) {
    return queryInterface
      .bulkDelete('Products', null, {})
      .catch(error => logger.error(error))
  }
}

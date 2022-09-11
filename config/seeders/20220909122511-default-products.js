import logger from 'winston'
import demoProducts from '../products.json'

const products = []
const insights = []
const now = new Date()

let index = 1
demoProducts.forEach((product) => {
  products.push({
    name: product.name,
    createdAt: now,
    updatedAt: now,
    amount: product.price
  })
  insights.push({
    productId: index,
    createdAt: now,
    updatedAt: now
  })
  index += 1
})

export default {
  up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.bulkInsert(
        'Products',
        products,
      ).catch(error => {
        console.log(error)
      }),
      queryInterface.bulkInsert(
        'ProductInsights',
        insights,
      ).catch(error => {
        console.log(error)
      }),
    ])
  },

  down (queryInterface, Sequelize) {
    return queryInterface
      .bulkDelete('Products', null, { casscade: true })
      .catch(error => logger.error(error))
  }
}

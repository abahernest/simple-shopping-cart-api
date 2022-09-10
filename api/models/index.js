import { Sequelize } from 'sequelize'
import config from '../../config/sequelize.js'

// models
import User from './user.model.js'
import Product from './product.model.js'
import ProductInsights from './productInsights.model.js'
import Basket from './basket.model.js'

const sequelize = new Sequelize(config.url, config)

const models = {
  User: User.init(sequelize, Sequelize),
  Product: Product.init(sequelize, Sequelize),
  ProductInsights: ProductInsights.init(sequelize, Sequelize),
  Basket: Basket.init(sequelize, Sequelize),
}

Object.keys(models).forEach((model) => {
  if (models[model].associate) {
    models[model].associate(models)
  }
  if (models[model].hooks) {
    models[model].hooks(models)
  }
})

const database = {
  ...models,
  sequelize
}

export default database

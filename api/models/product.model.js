import { DataTypes, Model } from 'sequelize'
import logger from '../../config/logger.js'

/**
 * Product Model
 *
 * @export
 * @class Product
 * @extends {Model}
 */
export default class Product extends Model {
  static modelFields = {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'There is an existing product with this name.',
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'name cannot be empty',
        },
      },
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        moreThan1 (value) {
          if (parseInt(value) < 1) {
            throw new Error('amount cannot be less than 1')
          }
        },
      },
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
  }

  /**
   * initializes the Product Model
   *
   * @static
   * @memberof Product
   *
   * @param {any} sequelize The sequelize object
   *
   * @returns {objct} the Product model
   */
  static init (sequelize) {
    const model = super.init(Product.modelFields, { sequelize })
    return model
  }

  /**
   * Product model associations
   *
   * @static
   * @memberof Product
   *
   * @param {any} models All models in the app
   *
   * @returns {null} no return
   */
  static associate (models) {
    const { ProductInsights, User, Basket } = models

    Product.hasOne(ProductInsights, {
      foreignKey: {
        name: 'productId',
        allowNull: false,
      },
    })

    Product.belongsToMany(User, {
      through: Basket,
      foreignKey: 'productId'
    })
  }

  /**
   * Product model hooks
   *
   * @static
   * @memberof Product
   *
   * @param {any} models All models in the app
   *
   * @returns {null} no return
   */
  static async hooks (models) {
    const { ProductInsights } = models
    await Product.addHook('afterCreate', async (product, options) => {
      try {
        await ProductInsights.create({
          productId: product.id,
        })
      } catch (error) {
        logger.error(error)
      }
    })
    await Product.addHook('afterBulkCreate', async (products, options) => {
      try {
        const productIds = products.map((product) => {
          return { productId: product.id }
        })
        await ProductInsights.bulkCreate(productIds)
      } catch (error) {
        logger.error(error)
      }
    })
  }
}

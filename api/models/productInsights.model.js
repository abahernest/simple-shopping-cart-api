import { DataTypes, Model } from 'sequelize'

/**
 * ProductInsights Model
 *
 * @export
 * @class ProductInsights
 * @extends {Model}
 */

export default class ProductInsights extends Model {
  static modelFields = {
    timesPurchased: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validae: {
        min: {
          args: 0,
          msg: 'timesPurchased cannot be negative',
        },
      },
    },
    timesRemovedFromBasket: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validae: {
        min: {
          args: 0,
          msg: 'timesRemovedFromBasket cannot be negative',
        },
      },
    },
    timesAddedToBasket: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validae: {
        min: {
          args: 0,
          msg: 'amount cannot be negative',
        },
      },
    },
  }

  /**
   * initializes the ProductInsights Model
   *
   * @static
   * @memberof ProductInsights
   *
   * @param {any} sequelize The sequelize object
   *
   * @returns {objct} the Product model
   */
  static init (sequelize) {
    const model = super.init(ProductInsights.modelFields, { sequelize })
    return model
  }

  /**
   * ProductInsights model associations
   *
   * @static
   * @memberof ProductInsights
   *
   * @param {any} models All models in the app
   *
   * @returns {null} no return
   */
  static associate (models) {
    const { Product } = models

    ProductInsights.belongsTo(Product)
  }
}

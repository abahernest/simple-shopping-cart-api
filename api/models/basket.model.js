import { Model } from 'sequelize'

/**
 * Basket Model
 *
 * @export
 * @class Basket
 * @extends {Model}
 */

export default class Basket extends Model {
  static modelFields = {
  }

  /**
   * initializes the Basket Model
   *
   * @static
   * @memberof Basket
   *
   * @param {any} sequelize The sequelize object
   *
   * @returns {objct} the Basket model
   */
  static init (sequelize) {
    const model = super.init(Basket.modelFields, { sequelize })
    return model
  }
}

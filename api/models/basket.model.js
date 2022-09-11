import logger from '../../config/logger.js'
import { Model, DataTypes } from 'sequelize'

/**
 * Basket Model
 *
 * @export
 * @class Basket
 * @extends {Model}
 */
export default class Basket extends Model {
  static modelFields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    purchased: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    datePurchased: {
      type: DataTypes.DATE,
    }
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

  /**
   * Basket model hooks
   *
   * @static
   * @memberof Basket
   *
   * @param {any} models All models in the app
   *
   * @returns {null} no return
   */
  static async hooks (models) {
    const { ProductInsights } = models
    await Basket.addHook('afterCreate', async (basketItem, options) => {
      try {
        const insightObj = await ProductInsights.findOne({ where: { productId: basketItem.productId } })
        await insightObj.incrementTimesAddedToBasket()
      } catch (error) {
        logger.error(error)
      }
    })
    await Basket.addHook('afterBulkCreate', async (basketItems, options) => {
      try {
        basketItems.forEach(async (basketItem) => {
          const insightObj = await ProductInsights.findOne({
            where: { productId: basketItem.productId },
          })
          await insightObj.incrementTimesAddedToBasket()
        })
      } catch (error) {
        logger.error(error)
      }
    })
    await Basket.addHook('afterDestroy', async (basketItem, options) => {
      try {
        const insightObj = await ProductInsights.findOne({
          where: { productId: basketItem.productId },
        })
        await insightObj.incrementTimesRemovedFromBasket()
      } catch (error) {
        logger.error(error)
      }
    })

    // await Basket.addHook("afterBulkDestroy", async (basketItems, options) => {
    //   try {
    //     basketItems.forEach(async (basketItem)=>{
    //       let insightObj = await ProductInsights.findOne({
    //         where: { productId: basketItem.productId },
    //       });
    //       await insightObj.incrementTimesRemovedFromBasket();
    //     })
    //   } catch (error) {
    //     logger.error(error);
    //   }
    // });

    await Basket.addHook('afterUpdate', async (basketItem, options) => {
      try {
        const insightObj = await ProductInsights.findOne({
          where: { productId: basketItem.productId },
        })
        await insightObj.incrementTimesPurchased()
      } catch (error) {
        logger.error(error)
      }
    })

    // await Basket.addHook("afterBulkUpdate", async (basketItems, options) => {
    //   try {
    //     basketItems.forEach(async (basketItem) => {
    //       let insightObj = await ProductInsights.findOne({
    //         where: { productId: basketItem.productId },
    //       });
    //       await insightObj.incrementTimesPurchased();
    //     });
    //   } catch (error) {
    //     logger.error(error);
    //   }
    // });
  }
}

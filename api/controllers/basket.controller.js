import { Op } from 'sequelize'
import User from '../models/user.model.js'
import Product from '../models/product.model.js'
import Basket from '../models/basket.model.js'

/**
 * Add New Product To User Basket
 *
 * @param {any} data - javascript object
 * @returns {object} - {code, status, error, message, data}
 */
export async function New (data) {
  try {
    const { userId, productId } = data
    const product = await Product.findByPk(productId)
    await product.setUsers(userId)
    return {
      code: 200,
      status: 'success',
      error: false
    }
  } catch (e) {
    return {
      code: 500,
      status: 'failure',
      error: true,
      message: e.message,
    }
  }
}

/**
 * All Product In User Basket
 *
 * @param {any} data - javascript object
 * @returns {object} - {code, status, error, message, data}
 */
export async function UserBasket (data) {
  try {
    const { id: userId } = data
    const { purchased } = data.query
    const query = { purchased: false }

    if (purchased) {
      query.purchased = true
    }

    const user = await User.findByPk(userId)
    const basket = await user.getProducts({ through: query })
    return {
      code: 200,
      status: 'success',
      error: false,
      data: basket,
    }
  } catch (e) {
    return {
      code: 500,
      status: 'failure',
      error: true,
      message: e.message,
    }
  }
}

/**
 * Purchase An Item From User Basket
 *
 * @param {any} data - javascript object
 * @returns {object} - {code, status, error, message, data}
 */
export async function PurchaseItems (data) {
  try {
    const { productIds, userId } = data

    const basket = await Basket.update(
      { purchased: true, datePurchased: new Date() },
      {
        where: {
          userId,
          productId: { [Op.in]: productIds },
          purchased: false
        },
        returning: true,
        individualHooks: true
      }
    )

    return {
      code: 200,
      status: 'success',
      error: false,
      data: basket[1]
    }
  } catch (e) {
    return {
      code: 500,
      status: 'failure',
      error: true,
      message: e.message,
    }
  }
}

/**
 * Remove An Unpurchased Item From User Basket
 *
 * @param {any} data - javascript object
 * @returns {object} - {code, status, error, message, data}
 */
export async function Remove (data) {
  try {
    const { productIds, userId } = data

    await Basket.destroy({
      where: {
        userId,
        productId: { [Op.in]: productIds },
        purchased: false,
      },
      individualHooks: true
    })

    return {
      code: 200,
      status: 'success',
      error: false
    }
  } catch (e) {
    return {
      code: 500,
      status: 'failure',
      error: true,
      message: e.message,
    }
  }
}

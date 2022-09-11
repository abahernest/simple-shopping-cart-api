import database from '../models/index.js'
import { Op } from 'sequelize'
const { Product, ProductInsights } = database

/**
 * Add A New Product To App
 *
 * @param {any} data - javascript object
 * @returns {object} - {code, status, error, message, data}
 */
export async function NewProduct (data) {
  try {
    const newItem = await Product.create(data)
    return {
      code: 200,
      status: 'success',
      error: false,
      data: newItem
    }
  } catch (error) {
    return {
      code: 500,
      status: 'failure',
      error: true,
      message: error.message
    }
  }
}

/**
 * Fetch All Available Products
 *
 * @param {any} data - javascript object
 * @returns {object} - {code, status, error, message, data}
 */
export async function AllProducts (data) {
  try {
    const { search } = data

    const query = {}
    if (search) {
      query.where = {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            description: {
              [Op.iLike]: `%${search}%`,
            },
          },
        ],
      }
    }

    const products = await Product.findAll(query)
    return {
      code: 200,
      status: 'success',
      error: false,
      data: products,
    }
  } catch (error) {
    return {
      code: 500,
      status: 'failure',
      error: true,
      message: error.message,
    }
  }
}

/**
 * Fetch Insights For A Single Product
 *
 * @param {any} productId - javascript object
 * @returns {object} - {code, status, error, message, data}
 */
export async function FetchInsights (productId) {
  try {
    const products = await Product.findOne({
      where: { id: productId },
      include: {
        model: ProductInsights,
        attributes: {
          exclude: [
            'id',
            'createdAt',
            'updatedAt',
            'productId'
          ]
        },
      },
    })
    return {
      code: 200,
      status: 'success',
      error: false,
      data: products,
    }
  } catch (error) {
    return {
      code: 500,
      status: 'failure',
      error: true,
      message: error.message,
    }
  }
}

/**
 * Fetch Insights For All Products
 *
 * @param {any} data - javascript object
 * @returns {object} - {code, status, error, message, data}
 */
export async function AllProductsInsights () {
  try {
    const products = await Product.findAll({
      include: {
        model: ProductInsights,
        attributes: {
          exclude: ['id', 'createdAt', 'updatedAt', 'productId'],
        },
      },
    })
    return {
      code: 200,
      status: 'success',
      error: false,
      data: products,
    }
  } catch (error) {
    return {
      code: 500,
      status: 'failure',
      error: true,
      message: error.message,
    }
  }
}

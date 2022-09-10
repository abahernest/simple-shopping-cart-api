
import Product from '../models/product.model.js'

export async function newProduct (requestBody) {
  try {
    const newItem = await Product.create(requestBody)
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

export async function allProducts () {
  try {
    const products = await Product.findAll()
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

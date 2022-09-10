import express from 'express'
// controllers
import { newProduct, allProducts } from '../controllers/product.controller.js'
// validators
import { validateNewProduct } from '../validators/product.validators.js'

const router = express.Router()

router.post('/', validateNewProduct, async (req, res, next) => {
  try {
    const newItem = await newProduct(req.body)

    return res.status(newItem.code).json(newItem)
  } catch (e) {
    next()
    return res.status(500).json({
      code: 500,
      status: 'failed',
      error: true,
      message: e.message,
    })
  }
})

router.get('/', async (req, res, next) => {
  try {
    const products = await allProducts(req.body)

    return res.status(products.code).json(products)
  } catch (e) {
    next()
    return res.status(500).json({
      code: 500,
      status: 'failed',
      error: true,
      message: e.message,
    })
  }
})

export default router

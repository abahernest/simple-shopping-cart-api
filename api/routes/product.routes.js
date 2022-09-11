import express from 'express'
// controllers
import {
  NewProduct,
  AllProducts,
  FetchInsights,
  AllProductsInsights
} from '../controllers/product.controller.js'
// validators
import {
  validateNewProduct
} from '../validators/product.validators.js'

const router = express.Router()

router.post('/', validateNewProduct, async (req, res, next) => {
  try {
    const newItem = await NewProduct(req.body)

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
    const products = await AllProducts(req.query)

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

router.get('/:productId/insights', async (req, res, next) => {
  try {
    const insight = await FetchInsights(req.params.productId)

    return res.status(insight.code).json(insight)
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

router.get('/insights', async (req, res, next) => {
  try {
    const insights = await AllProductsInsights(req.params.productId)

    return res.status(insights.code).json(insights)
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

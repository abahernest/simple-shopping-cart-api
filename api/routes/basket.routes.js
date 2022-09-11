import express from 'express'

import isAuth from '../middlewares/authentication.js'

import { New, UserBasket, PurchaseItems, Remove } from '../controllers/basket.controller.js'

// validators
import {
  validateAddToBasket,
  validateProductPurchase,
  validateRemoveFromBasket
} from '../validators/basket.validators.js'

const router = express.Router()

router.post('/add', validateAddToBasket, isAuth, async (req, res, next) => {
  try {
    req.body.userId = req.currentUser.id
    const newItem = await New(req.body)

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

router.get('/me', isAuth, async (req, res, next) => {
  try {
    const basket = await UserBasket({ id: req.currentUser.id, query: req.query })

    return res.status(basket.code).json(basket)
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

router.post('/purchase', validateProductPurchase, isAuth, async (req, res, next) => {
  try {
    req.body.userId = req.currentUser.id
    const basket = await PurchaseItems(req.body)

    return res.status(basket.code).json(basket)
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

router.delete(
  '/remove',
  validateRemoveFromBasket,
  isAuth,
  async (req, res, next) => {
    try {
      req.body.userId = req.currentUser.id
      const basket = await Remove(req.body)

      return res.status(basket.code).json(basket)
    } catch (e) {
      next()
      return res.status(500).json({
        code: 500,
        status: 'failed',
        error: true,
        message: e.message,
      })
    }
  }
)

export default router

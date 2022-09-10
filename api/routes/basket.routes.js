import express from 'express'

import isAuth from '../middleware/authentication.js'

import { addToBasket, myBasket } from '../controllers/basket.controller.js'

// validators
import {
  validateAddToBasket
} from '../validators/basket.validators.js'

const router = express.Router()

router.post('/add', validateAddToBasket, isAuth, async (req, res, next) => {
  try {
    const newItem = await addToBasket(req.body)

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
    const basket = await myBasket(req.body)

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

export default router

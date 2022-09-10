import express from 'express'
// controllers
import { FetchInsights } from '../controllers/productInsights.controller.js'

const router = express.Router()

router.get('/{productId}', async (req, res, next) => {
  try {
    const insights = await FetchInsights(req.params.productId)

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

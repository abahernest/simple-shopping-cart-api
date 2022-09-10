import express from 'express'

// import AuthRouter from './auth.routes.js';
import ProductRouter from './product.routes.js'
// import BasketRouter from './basket.routes.js';
// import ProductInsightsRouter from './productInsights.routes.js';

const router = express.Router()

// router.use('/auth', AuthRouter)
router.use('/products', ProductRouter)
// router.use('/product-insights', ProductInsightsRouter)
// router.use('/basket', BasketRouter)

export default router

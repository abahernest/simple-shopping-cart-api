import express from 'express'

import {
  Signup,
  Login,
} from '../controllers/auth.controller.js'

// validators
import {
  validateSignup,
  validateLogin,
} from '../validators/user.validators.js'

const router = express.Router()

// Signup
router.post('/signup', validateSignup, async (req, res, next) => {
  try {
    const user = await Signup(req.body)

    return res.status(user.code).json(user)
  } catch (e) {
    next()
    return res.status(500).json({
      code: 500,
      status: 'failed',
      error: true,
      message: 'something went wrong, cannot signup',
    })
  }
})

// Login
router.post('/signin', validateLogin, async (req, res, next) => {
  try {
    const user = await Login(req.body)

    return res.status(user.code).json(user)
  } catch (e) {
    next()
    return res.status(500).json({
      code: 500,
      status: 'failed',
      error: true,
      message: 'something went wrong, cannot login',
    })
  }
})

export default router

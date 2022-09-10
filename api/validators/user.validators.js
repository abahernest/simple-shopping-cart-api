import { validator, sendError } from './index.js'

export function validateSignup (req, res, next) {
  const validationRule = {
    email: 'required|string|email',
    firstname: 'required|string',
    lastname: 'required|string',
    password: 'required|string'
  }
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      sendError(res, err)
    } else {
      next()
    }
  })
}

export function validateLogin (req, res, next) {
  const validationRule = {
    email: 'required|string|email',
    password: 'required|string',
  }

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      sendError(res, err)
    } else {
      next()
    }
  })
}

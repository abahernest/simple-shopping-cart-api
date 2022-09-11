import { validator, sendError } from './index.js'

/**
 * Validate Request Body For User Signup
 *
 * @param {any} req - request Object
 * @param {any} res - response object
 * @param {any} next - handler to next middleware
 * @returns {any} - {code, status, error, message, data} | next
 */
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

/**
 * Validate Request Body For User Login
 *
 * @param {any} req - request Object
 * @param {any} res - response object
 * @param {any} next - handler to next middleware
 * @returns {any} - {code, status, error, message, data} | next
 */
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

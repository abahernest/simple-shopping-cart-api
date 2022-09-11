import { validator, sendError } from './index.js'

/**
 * Validate Request Body For Adding Product To Basket
 *
 * @param {any} req - request Object
 * @param {any} res - response object
 * @param {any} next - handler to next middleware
 * @returns {any} - {code, status, error, message, data} | next
 */
export function validateAddToBasket (req, res, next) {
  const validationRule = {
    productId: 'required|numeric',
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
 * Validate Request Body For Validating Product Purchase
 *
 * @param {any} req - request Object
 * @param {any} res - response object
 * @param {any} next - handler to next middleware
 * @returns {any} - {code, status, error, message, data} | next
 */
export function validateProductPurchase (req, res, next) {
  const validationRule = {
    productIds: 'required|array|containsInteger',
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
 * Validate Request Body For Removing Product from Basket
 *
 * @param {any} req - request Object
 * @param {any} res - response object
 * @param {any} next - handler to next middleware
 * @returns {any} - {code, status, error, message, data} | next
 */
export function validateRemoveFromBasket (req, res, next) {
  const validationRule = {
    productIds: 'required|array|containsInteger',
  }
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      sendError(res, err)
    } else {
      next()
    }
  })
}

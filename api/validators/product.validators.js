import { validator, sendError } from './index.js'

/**
 * Validate Request Body For Creating New Object
 *
 * @param {any} req - request Object
 * @param {any} res - response object
 * @param {any} next - handler to next middleware
 * @returns {any} - {code, status, error, message, data} | next
 */
export function validateNewProduct (req, res, next) {
  const validationRule = {
    amount: 'required|numeric|min:0',
    name: 'required|string|min:1',
    description: 'string|min:1'
  }
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      sendError(res, err)
    } else {
      next()
    }
  })
}

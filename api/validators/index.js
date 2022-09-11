import Validator from 'validatorjs'

/**
 * Validator Util Function
 *
 * @param {any} body - javascript object
 * @param {any} rules - javascript object
 * @param {any} customMessages - javascript object
 * @param {any} callback - callback object
 * @returns {any} - {code, status, error, message, data}
 */
export function validator (body, rules, customMessages, callback) {
  const validation = new Validator(body, rules, customMessages)
  validation.passes(() => callback(null, true))
  validation.fails(() => callback(validation.errors, false))
}

/**
 * Send Validation Error Message
 *
 * @param {any} res - response object
 * @param {any} err - error object
 * @returns {any} - {code, status, error, message, data}
 */
export function sendError (res, err) {
  const firstError = err.errors[Object.keys(err.errors)[0]][0]
  res.status(412).send({
    code: 412,
    status: 'failed',
    error: true,
    message: firstError,
  })
}

// Custom validator to verify phoneNo
Validator.register('containsInteger', function (value, requirement, attribute) {
  return value.every((item) => {
    if (typeof (item) === 'number') {
      return true
    } else {
      return false
    }
  })
}, 'The :attribute must contain integer')

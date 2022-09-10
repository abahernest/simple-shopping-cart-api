import { validator, sendError } from './index.js'

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

// model
import database from '../models/index.js'

const { User } = database

/**
 * User Signup
 *
 * @param {any} data - javascript object
 * @returns {any} - {code, status, error, message, data}
 */
export async function Signup (data) {
  try {
    // Check that user email is unique
    const user = await User.create(data)

    const token = user.generateJWToken()

    return {
      code: 200,
      status: 'success',
      error: false,
      data: {
        token
      },
    }
  } catch (e) {
    return {
      code: 500,
      status: 'failed',
      error: true,
      message: e.message,
    }
  }
}

/**
 * User Login
 *
 * @static
 * @param {any} data - object
 * @returns {object} - {code, status, error, message, data}
 */
export async function Login (data) {
  try {
    // Check that user email exists
    const user = await User.findOne({
      where: { email: data.email }
    })

    if (!user) {
      return {
        code: 400,
        status: 'failed',
        error: true,
        message: 'wrong credentials',
      }
    }

    const isValidPassword = user.comparePassword(data.password)
    if (!isValidPassword) {
      return {
        code: 400,
        status: 'failed',
        error: true,
        message: 'wrong credentials',
      }
    }

    const token = user.generateJWToken()

    return {
      code: 200,
      status: 'success',
      error: false,
      data: {
        token,
        user,
      },
    }
  } catch (e) {
    return {
      code: 500,
      status: 'failed',
      error: true,
      message: e.message,
    }
  }
}

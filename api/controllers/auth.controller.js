// model
import User from '../models/user.model.js'
import { hash, verifyHash, generateJwtToken } from '../helpers/jwtHelper.js'

export async function Signup (data) {
  try {
    // Check that user email is unique
    let user = await User.where({ email: data.email })

    if (user.length >= 1) {
      return {
        code: 400,
        status: 'failed',
        error: true,
        message: 'email already exists',
      }
    }
    // hash password
    data.password = await hash(data.password.toString())

    // generate jwt
    const token = await generateJwtToken(data)

    // create user
    user = await User.create(data)

    return {
      code: 200,
      status: 'success',
      error: false,
      message: 'Successful',
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
      message: 'something went wrong, could not signup',
    }
  }
}

export async function Login (data) {
  try {
    // Check that user email exists
    const user = User.findOne({
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
    // validate password
    const isValidPassword = await verifyHash(
      data.password.toString(),
      user.password
    )

    if (!isValidPassword) {
      return {
        code: 400,
        status: 'failed',
        error: true,
        message: 'wrong credentials',
      }
    }
    // generate jwt
    const token = await generateJwtToken(user)

    delete user.password
    return {
      code: 200,
      status: 'success',
      error: false,
      message: 'Successful',
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
      message: 'something went wrong, could not login',
    }
  }
}

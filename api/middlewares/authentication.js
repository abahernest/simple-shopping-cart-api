import User from '../models/user.model.js'

const isAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if ((authHeader && authHeader.split(' ')[0] === 'Token') || (authHeader && authHeader.split(' ')[0] === 'Bearer')) {
    const token = authHeader.split(' ')[1]

    try {
      const decodedToken = User.verifyAuthToken(token)
      if (!decodedToken.id) {
        return res.status(401).json({
          code: 401,
          status: 'failure',
          error: true,
          message: 'Token Expired',
        })
      }

      // Check that user with id and email still exists
      const user = await User.findOne({
        where: {
          id: decodedToken.id,
          email: decodedToken.email,
        }
      })

      if (!user) {
        return res.status(401).json({
          code: 401,
          status: 'failure',
          error: true,
          message: 'Invalid Token. Login Again',
        })
      }
      req.currentUser = decodedToken
      next()
    } catch (error) {
      return res.status(401).json({
        code: 401,
        status: 'failure',
        error: true,
        message: 'Invalid authorization header',
      })
    }
  } else {
    return res.status(401).json({
      code: 401,
      status: 'failure',
      error: true,
      message: 'Access denied! No token provided',
    })
  }
}

export default isAuth

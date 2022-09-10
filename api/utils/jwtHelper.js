import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export async function generateJwtToken (user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      firstname: user.fullname
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' },
  )
}

export async function tokenVerifier (authToken) {
  const decoded = jwt.verify(authToken, process.env.JWT_SECRET)
  return decoded
};

export function tokennize (data) {
  return jwt.sign(data, process.env.JWT_SECRET)
}

export async function hash (param) {
  return await bcrypt.hash(param, 12)
}

export async function verifyHash (param, hashedPram) {
  return await bcrypt.compare(param, hashedPram)
}

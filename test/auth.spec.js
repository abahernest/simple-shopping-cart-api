import request from 'supertest'

import database from '../api/models/index.js'
import app from '../app.js'

const { sequelize } = database

describe('Auth', () => {
  describe('SignUp', () => {
    beforeAll(() => {
      return sequelize.sync({ force: true })
    })
    afterAll(() => sequelize.sync({ force: true }))

    test('Should return 412 if email not provided', async () => {
      const result = await request(app).post('/api/v1/auth/signup').send({
        firstname: 'sample',
        lastname: 'user',
        password: 'P@ssw0rd',
      })

      expect(result.statusCode).toEqual(412)
      expect(result.body.message).toEqual('The email field is required.')
    })

    test('Should return 412 for invalid email', async () => {
      const result = await request(app).post('/api/v1/auth/signup').send({
        email: 'sample.email.com',
        firstname: 'sample',
        lastname: 'user',
        password: 'P@ssw0rd',
      })

      expect(result.statusCode).toEqual(412)
      expect(result.body.message).toEqual('The email format is invalid.')
    })

    test('Should return 412 if firstname not provided', async () => {
      const result = await request(app).post('/api/v1/auth/signup').send({
        email: 'sample@email.com',
        lastname: 'user',
        password: 'P@ssw0rd',
      })

      expect(result.statusCode).toEqual(412)
      expect(result.body.message).toEqual('The firstname field is required.')
    })

    test('Should return 412 if lastname not provided', async () => {
      const result = await request(app).post('/api/v1/auth/signup').send({
        email: 'sample@email.com',
        firstname: 'sample',
        password: 'P@ssw0rd',
      })

      expect(result.statusCode).toEqual(412)
      expect(result.body.message).toEqual(
        'The lastname field is required.'
      )
    })

    test('Should return 412 if password not provided', async () => {
      const result = await request(app).post('/api/v1/auth/signup').send({
        email: 'sample@email.com',
        firstname: 'sample',
        lastname: 'user',
      })

      expect(result.statusCode).toEqual(412)
      expect(result.body.message).toEqual('The password field is required.')
    })

    test('Should return 412 if password too short', async () => {
      const result = await request(app).post('/api/v1/auth/signup').send({
        email: 'sample@email.com',
        firstname: 'sample',
        lastname: 'user',
        password: 'pass',
      })

      expect(result.statusCode).toEqual(412)
      expect(result.body.message).toEqual(
        'The password must be at least 8 characters.'
      )
    })

    test('Should return 200 if successful', async () => {
      const result = await request(app).post('/api/v1/auth/signup').send({
        email: 'sample@email.com',
        firstname: 'sample',
        lastname: 'user',
        password: 'password',
      })

      expect(result.statusCode).toEqual(200)
      expect(result.body.data.token).toBeDefined()
    })

    test('Should return 500 if email already exists', async () => {
      const result = await request(app).post('/api/v1/auth/signup').send({
        email: 'sample@email.com',
        firstname: 'sample',
        lastname: 'user',
        password: 'password',
      })

      expect(result.statusCode).toEqual(500)
      expect(result.body.message).toEqual(
        'There is an existing account with this email address.'
      )
    })
  })

  describe('Login', () => {
    beforeAll(() => {
      return sequelize.sync({ force: true })
    })

    beforeAll(async () => {
      return await database.User.create({
        email: 'sample@email.com',
        firstname: 'sample',
        lastname: 'user',
        password: 'password',
      })
    })

    afterAll(() => sequelize.sync({ force: true }))

    test('Should return 412 if email not provided', async () => {
      const result = await request(app).post('/api/v1/auth/signin').send({
        password: 'password',
      })

      expect(result.statusCode).toEqual(412)
      expect(result.body.message).toEqual('The email field is required.')
    })

    test('Should return 412 for invalid email', async () => {
      const result = await request(app).post('/api/v1/auth/signin').send({
        email: 'sample.email.com',
        password: 'P@ssw0rd',
      })

      expect(result.statusCode).toEqual(412)
      expect(result.body.message).toEqual('The email format is invalid.')
    })

    test('Should return 412 if password not provided', async () => {
      const result = await request(app).post('/api/v1/auth/signin').send({
        email: 'sample@email.com',
      })

      expect(result.statusCode).toEqual(412)
      expect(result.body.message).toEqual('The password field is required.')
    })

    test('Should return 412 if password too short', async () => {
      const result = await request(app).post('/api/v1/auth/signin').send({
        email: 'sample@email.com',
        password: 'pass',
      })

      expect(result.statusCode).toEqual(412)
      expect(result.body.message).toEqual(
        'The password must be at least 8 characters.'
      )
    })

    test('Should return 200 if successful', async () => {
      const result = await request(app).post('/api/v1/auth/signin').send({
        email: 'sample@email.com',
        password: 'password',
      })

      expect(result.statusCode).toEqual(200)
      expect(result.body.data.user.email).toEqual('sample@email.com')
    })
  })
})

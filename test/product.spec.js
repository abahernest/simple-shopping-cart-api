import request from 'supertest'

import database from '../api/models/index.js'
import app from '../app.js'

const { sequelize } = database

describe('Product', () => {
  describe('NewProduct', () => {
    beforeAll(() => {
      return sequelize.sync({ force: true })
    })

    afterAll(() => sequelize.sync({ force: true }))

    test('Should return 412 if amount not provided', async () => {
      const result = await request(app).post('/api/v1/products').send({
        name: 'sample',
        description: 'descr'
      })

      expect(result.statusCode).toEqual(412)
      expect(result.body.message).toEqual('The amount field is required.')
    })

    test('Should return 412 for if amount less than 0', async () => {
      const result = await request(app).post('/api/v1/products').send({
        amount: -1,
        name: 'sample',
        description: 'descr',
      })

      expect(result.statusCode).toEqual(412)
      expect(result.body.message).toEqual('The amount must be at least 0.')
    })

    test('Should return 412 if name not provided', async () => {
      const result = await request(app).post('/api/v1/products').send({
        amount: 100,
        description: 'descr',
      })

      expect(result.statusCode).toEqual(412)
      expect(result.body.message).toEqual('The name field is required.')
    })

    test('Should return 200 if successful', async () => {
      const result = await request(app).post('/api/v1/products').send({
        amount: 100,
        name: 'sample',
        description: 'descr',
      })

      expect(result.statusCode).toEqual(200)
      expect(result.body.data).toBeDefined()
    })

    test('Should create productInsight Object as well if successful', async () => {
      const result = await request(app).post('/api/v1/products').send({
        amount: 100,
        name: 'sample1',
        description: 'descr',
      })
      const productId = result.body.data.id
      const insights = await database.ProductInsights.findOne({ where: { productId } })
      expect(result.statusCode).toEqual(200)
      expect(insights).toBeDefined()
    })

    test('Should return 500 if email already exists', async () => {
      const result = await request(app).post('/api/v1/products').send({
        amount: 100,
        name: 'sample',
        description: 'descr',
      })

      expect(result.statusCode).toEqual(500)
      expect(result.body.message).toEqual(
        'There is an existing product with this name.'
      )
    })
  })

  describe('AllProducts', () => {
    beforeAll(() => {
      return sequelize.sync({ force: true })
    })

    beforeAll(() => {
      return database.Product.create({
        name: 'seededName',
        amount: 130,
        description: 'descr'
      })
    })

    afterAll(() => sequelize.sync({ force: true }))

    test('Should return 200 if successful', async () => {
      const result = await request(app).get('/api/v1/products')

      expect(result.statusCode).toEqual(200)
      expect(result.body.data).toHaveLength(1)
    })
  })

  describe('ProductInsights', () => {
    let productId
    beforeAll(() => {
      return sequelize.sync({ force: true })
    })

    beforeAll(async () => {
      const product = await database.Product.create({
        name: 'seededName',
        amount: 130,
        description: 'descr',
      })
      productId = product.id
    })

    afterAll(() => sequelize.sync({ force: true }))

    test('Should return 200 if successful', async () => {
      const result = await request(app).get(`/api/v1/products/${productId}/insights`)

      expect(result.statusCode).toEqual(200)
      expect(result.body.data.ProductInsight).toBeDefined()
    })
  })

  describe('AllProductsInsights', () => {
    beforeAll(() => {
      return sequelize.sync({ force: true })
    })

    beforeAll(() => {
      return database.Product.create({
        name: 'seededName',
        amount: 130,
        description: 'descr',
      })
    })

    afterAll(() => sequelize.sync({ force: true }))

    test('Should return 200 if successful', async () => {
      const result = await request(app).get('/api/v1/products/insights')

      expect(result.statusCode).toEqual(200)
      expect(result.body.data).toHaveLength(1)
      expect(result.body.data[0].ProductInsight).toBeDefined()
    })
  })
})

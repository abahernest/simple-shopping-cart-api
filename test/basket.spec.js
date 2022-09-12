import request from 'supertest'

import database from '../api/models/index.js'
import app from '../app.js'

const { sequelize } = database

describe('Basket', () => {
  let seededProductId1, seededProductId2, authToken
  const seededUserEmail1 = 'sample@email.com', seededUserPassword1 = 'password'
  beforeAll(() => {
    return sequelize.sync({ force: true })
  })

  beforeAll(async () => {
    const product1 = await database.Product.create({
      name: 'sample',
      amount: 100,
      description: 'first'
    })
    seededProductId1 = product1.id

    const product2 = await database.Product.create({
      name: 'sample1',
      amount: 100,
      description: 'first',
    })
    seededProductId2 = product2.id
  })

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: seededUserEmail1,
        password: seededUserPassword1,
        firstname: 'sample',
        lastname: 'user'
      })

    authToken = response.body.data.token
  })

  afterAll(() => sequelize.sync({ force: true }))

  describe('AddToBasket', () => {
    test('Should return 412 if productId not provided', async () => {
      const result = await request(app).post('/api/v1/basket/add').send({
      })

      expect(result.statusCode).toEqual(412)
      expect(result.body.message).toEqual('The productId field is required.')
    })

    test('Should return 412 if productId is invalid', async () => {
      const result = await request(app).post('/api/v1/basket/add').send({
        productId: 'invalid',
      })

      expect(result.statusCode).toEqual(412)
      expect(result.body.message).toEqual('The productId must be an integer.')
    })

    test('Should return 401 missing authentication', async () => {
      const result = await request(app).post('/api/v1/basket/add').send({
        productId: 1,
      })

      expect(result.statusCode).toEqual(401)
      expect(result.body.message).toEqual('Access denied! No token provided')
    })

    test('Should return 200 if successful', async () => {
      const result = await request(app).post('/api/v1/basket/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: seededProductId1,
        })

      const basket = await database.Basket.findOne({ where: { productId: seededProductId1 } })
      const productInsight = await database.ProductInsights.findOne({ where: { productId: seededProductId1 } })
      expect(result.statusCode).toEqual(200)
      expect(basket).toBeDefined()
      expect(productInsight.timesAddedToBasket).toEqual(1)
    })

    test('Should not add same product to basket', async () => {
      const result = await request(app)
        .post('/api/v1/basket/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: seededProductId1,
        })
      const basket = await database.Basket.findAll({
        where: { productId: seededProductId1 },
      })
      const productInsight = await database.ProductInsights.findOne({
        where: { productId: seededProductId1 },
      })
      expect(result.statusCode).toEqual(200)
      expect(basket).toHaveLength(1)
      expect(productInsight.timesAddedToBasket).toEqual(1)
    })
  })

  describe('UserBasket', () => {
    test('Should return 401 missing authentication', async () => {
      const result = await request(app).get('/api/v1/basket/me')

      expect(result.statusCode).toEqual(401)
      expect(result.body.message).toEqual('Access denied! No token provided')
    })

    test('Should return 200 if successful', async () => {
      const result = await request(app)
        .get('/api/v1/basket/me')
        .set('Authorization', `Bearer ${authToken}`)

      expect(result.statusCode).toEqual(200)
      expect(result.body.data).toHaveLength(1)
      expect(result.body.data[0].Basket).toBeDefined()
    })
  })

  describe('Purchase', () => {
    test('Should return 412 if productIds not provided', async () => {
      const result = await request(app).post('/api/v1/basket/purchase').send({})

      expect(result.statusCode).toEqual(412)
      expect(result.body.message).toEqual('The productIds field is required.')
    })

    test('Should return 412 if productIds is invalid', async () => {
      const result = await request(app).post('/api/v1/basket/purchase').send({
        productIds: 'invalid',
      })

      expect(result.statusCode).toEqual(412)
      expect(result.body.message).toEqual('The productIds must be an array.')
    })

    test("Should return 412 if productIds doesn't contain integers", async () => {
      const result = await request(app).post('/api/v1/basket/purchase').send({
        productIds: ['invalid', 'invalid'],
      })

      expect(result.statusCode).toEqual(412)
      expect(result.body.message).toEqual(
        'The productIds must contain integer.'
      )
    })

    test('Should return 401 missing authentication', async () => {
      const result = await request(app).post('/api/v1/basket/purchase').send({
        productIds: [seededProductId1],
      })

      expect(result.statusCode).toEqual(401)
      expect(result.body.message).toEqual('Access denied! No token provided')
    })

    test('Should return 200 if successful', async () => {
      const result = await request(app)
        .post('/api/v1/basket/purchase')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productIds: [seededProductId1],
        })

      const basket = await database.Basket.findOne({
        where: { productId: seededProductId1 },
      })
      const productInsight = await database.ProductInsights.findOne({
        where: { productId: seededProductId1 },
      })
      expect(result.statusCode).toEqual(200)
      expect(basket.purchased).toEqual(true)
      expect(productInsight.timesPurchased).toEqual(1)
    })

    test('Should not purchase same product', async () => {
      const result = await request(app)
        .post('/api/v1/basket/purchase')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productIds: [seededProductId1],
        })
      const basket = await database.Basket.findOne({
        where: { productId: seededProductId1 },
      })
      const productInsight = await database.ProductInsights.findOne({
        where: { productId: seededProductId1 },
      })
      expect(result.statusCode).toEqual(200)
      expect(basket.purchased).toEqual(true)
      // timesPurchased didn't increase
      expect(productInsight.timesPurchased).toEqual(1)
    })
  })

  describe('Remove From Basket', () => {
    beforeAll(async () => {
      // Product must be added to user basket before it can be removed
      await request(app)
        .post('/api/v1/basket/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: seededProductId2,
        })
    })

    test('Should return 412 if productIds not provided', async () => {
      const result = await request(app)
        .delete('/api/v1/basket/remove')
        .send({})

      expect(result.statusCode).toEqual(412)
      expect(result.body.message).toEqual('The productIds field is required.')
    })

    test('Should return 412 if productIds is invalid', async () => {
      const result = await request(app).delete('/api/v1/basket/remove').send({
        productIds: 'invalid',
      })

      expect(result.statusCode).toEqual(412)
      expect(result.body.message).toEqual('The productIds must be an array.')
    })

    test("Should return 412 if productIds doesn't contain integers", async () => {
      const result = await request(app)
        .delete('/api/v1/basket/remove')
        .send({
          productIds: ['invalid', 'invalid'],
        })

      expect(result.statusCode).toEqual(412)
      expect(result.body.message).toEqual(
        'The productIds must contain integer.'
      )
    })

    test('Should return 401 missing authentication', async () => {
      const result = await request(app)
        .delete('/api/v1/basket/remove')
        .send({
          productIds: [seededProductId2],
        })

      expect(result.statusCode).toEqual(401)
      expect(result.body.message).toEqual('Access denied! No token provided')
    })

    test('Should not remove if purchased', async () => {
      const result = await request(app)
        .delete('/api/v1/basket/remove')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productIds: [seededProductId1],
        })

      const basket = await database.Basket.findOne({
        where: { productId: seededProductId1 },
      })
      const productInsight = await database.ProductInsights.findOne({
        where: { productId: seededProductId1 },
      })
      expect(result.statusCode).toEqual(200)
      expect(basket).toBeDefined()
      expect(productInsight.timesRemovedFromBasket).toEqual(0)
    })

    test('Should return 200 if successful', async () => {
      const result = await request(app)
        .delete('/api/v1/basket/remove')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productIds: [seededProductId2],
        })

      const basket = await database.Basket.findOne({
        where: { productId: seededProductId2 },
      })
      const productInsight = await database.ProductInsights.findOne({
        where: { productId: seededProductId2 },
      })

      expect(result.statusCode).toEqual(200)
      expect(basket).toBeNull()
      expect(productInsight.timesRemovedFromBasket).toEqual(1)
    })

    // test("Should not purchase same product", async () => {
    //   const result = await request(app)
    //     .post("/api/v1/basket/purchase")
    //     .set("Authorization", `Bearer ${authToken}`)
    //     .send({
    //       productIds: [seededProductId1],
    //     });
    //   const basket = await database.Basket.findOne({
    //     where: { productId: seededProductId1 },
    //   });
    //   const productInsight = await database.ProductInsights.findOne({
    //     where: { productId: seededProductId1 },
    //   });
    //   expect(result.statusCode).toEqual(200);
    //   expect(basket.purchased).toEqual(true);
    //   // timesPurchased didn't increase
    //   expect(productInsight.timesPurchased).toEqual(1);
    // });
  })
})

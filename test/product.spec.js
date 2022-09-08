// import request from 'supertest';

import database from '../api/models/index.js'
// import app from '../app.js';
// import assert from 'assert';

describe('Product', () => {
  beforeAll(async () => {
    await database.sequelize.sync({ force: true })
  })
  afterAll(() => database.sequelize.sync({ force: true }))

  test('Hello World', () => {
    expect('HELLO WORLD').toEqual('HELLO WORLD')
  })
})

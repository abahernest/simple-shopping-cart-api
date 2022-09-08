import fs from 'fs'
import path from 'path'
import { Sequelize } from 'sequelize'
import { fileURLToPath } from 'url'
import config from '../../config/sequelize.js'

const sequelize = new Sequelize(config.url, config)
const database = {}

/* eslint-disable no-global-assign */
globalThis.__filename = fileURLToPath(import.meta.url)

globalThis.__dirname = path.dirname(globalThis.__filename)
fs.readdirSync(globalThis.__dirname)
  .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js')
  .forEach((file) => {
    /* eslint-disable import/no-dynamic-require */
    /* eslint-disable global-require */
    const model = require(`./${file}`).default.init(sequelize)
    database[model.name] = model
  })

Object.keys(database).forEach((model) => {
  if (database[model].associate) {
    database[model].associate(database)
  }
})

database.sequelize = sequelize
database.Sequelize = Sequelize

export default database

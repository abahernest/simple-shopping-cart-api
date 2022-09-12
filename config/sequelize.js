import { config as getEnv } from 'dotenv'

getEnv()
const {
  TEST_DB, DB_NAME, DB_HOST, DB_USER, DB_PASSWORD
} = process.env
const databaseUrls = {
  development: `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
  test: `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${TEST_DB}`,
  production: `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`
}

const environment = process.env.NODE_ENV || 'development'
const dialect = 'postgres'
const url = databaseUrls[environment]
const devMode = environment === 'development' || environment === 'test'

const config = {
  url,
  dialect,
  logging: devMode ? log => log : false,
  dialectOptions: {
    multipleStatements: true
  },
  operatorsAliases: false,
  seederStorage: 'sequelize',
  seederStorageTableName: 'SequelizeSeeders'
}

// if (!devMode) {
//   config.ssl = true
//   config.dialectOptions.ssl = {
//     require: true
//   }
// }

export default config

import app from './app.js'
import logger from './config/logger.js'
import database from './api/models/index.js'
import dotenv from 'dotenv'

dotenv.config()

const port = process.env.PORT || 4000

database.sequelize
  .sync({ alter: true })
  .then(() => logger.info('Database Connected'))
  .then(() => {
    app.listen(port, () =>
      logger.info(`✅ Server started on port ${port}`))
  }).catch(() => logger.error('Database Connection Failed'))

process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...')
  // eslint-disable-next-line no-console
  console.log(err)
  //   console.log(err.name, err.message);
  process.exit(1)
})

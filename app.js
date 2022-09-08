import express from 'express'

// Import router
// import routes from "./routes/routes";

const app = express()

/** Parse the request */
app.use(express.urlencoded({ extended: false }))
/** Handle JSON data */
app.use(express.json())

/** RULES OF OUR API */
// Allow all requests from all domains & localhost
app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    `Origin, Accept, X-Requested-With, 
    Content-Type, Access-Control-Request-Method, 
    Access-Control-Request-Headers, X-Access-Token, 
    XKey, Authorization, Observe`
  )
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE')
  next()
})

/** Routes */
// app.use("/api/v1/", routes);

/** Error handling */
app.use((req, res) => res.status(404).json({
  code: 404,
  data: {
    message: 'resource not found',
    error: 'validation error'
  }
}))

export default app

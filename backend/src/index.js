require('dotenv').config();

const path = require('path');

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const RateLimit = require('express-rate-limit');
const createError = require('http-errors');

const DB = require('./modules/DB');

const app = express()

app.use(express.static(path.join(__dirname, '..', '/public')))
app.use(cors())
app.use(bodyParser.json())

const limiter = new RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 50,
  message: {
    error: {
      status: 429,
      message: 'Too many requests per minute'
    }
  }
})
app.use('/auth', limiter)
app.use('/api', limiter) 

app.use('/', require('./routes'))
app.use('/auth', require('./routes/auth'))
app.use('/api', require('./routes/api'))

app.use((req, res, next) => {
  next(createError.NotFound())
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.json({
    error: {
      status: err.status || 500,
      message: err.message
    }
  })
})

const httpServer = http.createServer(app)
const port = process.env.PORT || 8000;

DB().then(() => {
  httpServer.listen({ port }, () => {
    console.log(`Server run on ${process.env.BACKEND}`)
  })
}).catch(console.error)

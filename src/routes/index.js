const path = require('path');
const express = require('express');
const createError = require('http-errors');

const router = express.Router()

if (process.env.NODE_ENV === 'production') {
  router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'))
  })
} else {
  router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the MERN Forum root path' })
  })
  router.get('*', (req, res, next) => {
    next(createError.NotFound())
  })
}

module.exports = router

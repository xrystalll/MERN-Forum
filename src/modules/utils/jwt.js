const JWT = require('jsonwebtoken');
const Mongoose = require('mongoose');
const createError = require('http-errors');

const User = require('../models/User');

const signAccessToken = (user) => {
  return new Promise((resolve, reject) => {
    const payload = {
      id: user.id,
      name: user.name,
      displayName: user.displayName,
      picture: user.picture,
      role: user.role
    }
    JWT.sign(payload, process.env.SECRET, { expiresIn: '24h' }, (err, token) => {
      if (err) {
        console.error(err.message)
        return reject(createError.InternalServerError())
      }
      return resolve(token)
    })
  })
}

const verifyAccessToken = (req, res, next) => {
  if (!req.headers['authorization']) return next(createError.Unauthorized())

  const authHeader = req.headers['authorization']
  const bearerToken = authHeader.split(' ')
  const token = bearerToken[1]
  JWT.verify(token, process.env.SECRET, (err, payload) => {
    if (err) {
      const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
      return next(createError.Unauthorized(message))
    }
    req.payload = payload
    next()
  })
}

const verifyAccessTokenIO = (token) => {
  if (!token) return createError.Unauthorized()

  return JWT.verify(token, process.env.SECRET, (err, payload) => {
    if (err) {
      const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
      return createError.Unauthorized(message)
    }
    return payload
  })
}

module.exports = { signAccessToken, verifyAccessToken, verifyAccessTokenIO }

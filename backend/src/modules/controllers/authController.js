const createError = require('http-errors');

const User = require('../models/User');
const { registerSchema, loginSchema } = require('../utils/validationSchema');
const { signAccessToken } = require('../utils/jwt');

const register = async (req, res, next) => {
  try {
    const result = await registerSchema.validateAsync(req.body)

    const emailDoesExist = await User.findOne({ email: result.email })
    if (emailDoesExist) {
      throw createError.Conflict('E-mail is already been registered')
    }

    const username = result.username.toLowerCase()
    const userNamedoesExist = await User.findOne({ name: username })
    if (userNamedoesExist) {
      throw createError.Conflict('Username is already been registered')
    }

    const user = new User({
      name: username,
      displayName: result.username,
      email: result.email,
      password: result.password,
      createdAt: new Date().toISOString(),
      onlineAt: new Date().toISOString(),
      role: 'user'
    })
    const savedUser = await user.save()
    const accessToken = await signAccessToken(savedUser)

    res.json({
      user: {
        id: savedUser._id,
        name: savedUser.name,
        displayName: savedUser.displayName,
        picture: savedUser.picture,
        role: savedUser.role
      },
      accessToken
    })
  } catch(error) {
    if (error.isJoi === true) error.status = 422
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const result = await loginSchema.validateAsync(req.body)

    const username = result.username.toLowerCase()
    const user = await User.findOne({ name: username })
    if (!user) throw createError.NotFound('User not registered')

    const isMatch = await user.isValidPassword(result.password)
    if (!isMatch) throw createError.Unauthorized('Username or password not valid')

    const accessToken = await signAccessToken(user)

    res.json({
      user: {
        id: user._id,
        name: user.name,
        displayName: user.displayName,
        picture: user.picture,
        role: user.role
      },
      accessToken
    })
  } catch(error) {
    if (error.isJoi === true) {
      return next(createError.BadRequest('Invalid username or password'))
    }
    next(error)
  }
}

module.exports = { register, login }

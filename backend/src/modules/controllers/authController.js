const createError = require('http-errors');
const { isJapanese, toRomaji } = require('wanakana');

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

    let name = result.username.toLowerCase().replace(/\s/g, '')
    if (isJapanese(name)) {
      name = toRomaji(name)
    }

    const userNamedoesExist = await User.findOne({ name })
    if (userNamedoesExist) {
      throw createError.Conflict('Username is already been registered')
    }

    let displayName = result.username.replace(/\s/g, '')

    const user = new User({
      name,
      displayName,
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

    let name = result.username.toLowerCase().replace(/\s/g, '')
    if (isJapanese(name)) {
      name = toRomaji(name)
    }

    const user = await User.findOne({ name })
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

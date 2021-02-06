const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server-express');

const User = require('../../models/User');
const { validateRegisterInput, validateLoginInput } = require('../../util/validators');

const generateToken = (user) => {
  return jwt.sign({
    id: user.id,
    username: user.username,
    picture: user.picture,
    role: user.role
  }, process.env.SECRET, { expiresIn: '1h' })
}

module.exports = {
  Query: {
    async getUsers() {
      try {
        const users = await User.find().sort({ createdAt: -1 })
        return users
      } catch (err) {
        throw new Error(err)
      }
    },

    async getUser(_, { id }) {
      try {
        const user = await User.findById(id)
        return user
      } catch (err) {
        throw new Error(err)
      }
    }
  },

  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password)

      if (!valid) {
        throw new UserInputError('Errors', { errors })
      }

      const user = await User.findOne({ username })

      // wrong username
      if (!user) {
        errors.general = 'User not found'
        throw new UserInputError('User not found', { errors })
      }

      // wrong password
      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        errors.general = 'Wrong credentials'
        throw new UserInputError('Wrong credentials', { errors })
      }

      // login is good, issue the user a token
      const token = generateToken(user)

      return {
        ...user._doc,
        id: user._id,
        token
      }
    },

    async register(_, { registerInput: { username, email, password, confirmPassword } }) {
      // Validate user data
      const { errors, valid } = validateRegisterInput(username, email, password, confirmPassword)

      if (!valid) {
        throw new UserInputError('Errors', { errors })
      }

      const user = await User.findOne({ username })
      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken... sorry yo.'
          }
        })
      }

      // Hash the password
      password = await bcrypt.hash(password, 12)

      // create the new user with the model and passed in data
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
        onlineAt: new Date().toISOString(),
        role: 'user'
      })

      // save the user to the DB
      const res = await newUser.save()
      // Create auth token
      const token = generateToken(res)

      return {
        ...res._doc,
        id: res._id,
        token
      }
    }
  }
};

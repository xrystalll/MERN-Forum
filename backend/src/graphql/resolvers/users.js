const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const bcrypt = require('bcryptjs');
const Mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { AuthenticationError, UserInputError } = require('apollo-server-express');

const User = require('../../models/User');
const { validateRegisterInput, validateLoginInput } = require('../../util/validators');
const checkAuth = require('../../util/checkAuth');

const generateToken = (user) => {
  return jwt.sign({
    id: user.id,
    username: user.username,
    picture: user.picture,
    role: user.role
  }, process.env.SECRET, { expiresIn: '24h' })
}

module.exports = {
  Query: {
    async getUsers(_, { limit = 10, offset = 0, sort }) {
      try {
        let users
        if (sort === 'online') {
          const date = new Date()
          date.setMinutes(date.getMinutes() - 5)
          users = await User.paginate({ onlineAt: { $gte: date.toISOString() } }, { sort: { onlineAt: -1 }, offset, limit })
        } else if (sort === 'admin') {
          users = await User.paginate({ role: 'admin' }, { sort: { onlineAt: -1 }, offset, limit })
        } else if (sort === 'old') {
          users = await User.paginate({}, { sort: { createdAt: 1 }, offset, limit })
        } else {
          users = await User.paginate({}, { sort: { createdAt: -1 }, offset, limit })
        }
        return users.docs
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
      if (!user) {
        errors.general = 'User not found'
        throw new UserInputError('User not found', { errors })
      }

      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        errors.general = 'Wrong credentials'
        throw new UserInputError('Wrong credentials', { errors })
      }

      const token = generateToken(user)

      return {
        ...user._doc,
        id: user._id,
        token
      }
    },

    async register(_, { registerInput: { username, email, password, confirmPassword } }) {
      const { errors, valid } = validateRegisterInput(username, email, password, confirmPassword)

      if (!valid) {
        throw new UserInputError('Errors', { errors })
      }

      const user = await User.findOne({ username })
      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'Username is taken'
          }
        })
      }

      const checkEmail = await User.findOne({ email })
      if (checkEmail) {
        throw new UserInputError('Email already registered', {
          errors: {
            username: 'Email already registered'
          }
        })
      }

      password = await bcrypt.hash(password, 12)

      const newUser = new User({
        email,
        username: username.substring(0, 21),
        password,
        createdAt: new Date().toISOString(),
        onlineAt: new Date().toISOString(),
        role: 'user'
      })

      const res = await newUser.save()
      const token = generateToken(res)

      return {
        ...res._doc,
        id: res._id,
        token
      }
    },

    async editUser(_, { id, onlineAt }, context) {
      const { id: userId, role } = checkAuth(context)

      try {
        if (userId === id || role === 'admin') {
          await User.updateOne({ _id: Mongoose.Types.ObjectId(id) }, { onlineAt })

          const editedUser = await User.findById(id)
          return editedUser
        }

        throw new AuthenticationError('Action not allowed')
      } catch (err) {
        throw new Error(err)
      }
    },

    async uploadUserAvatar(_, { id, file }, context) {
      const { id: userId } = checkAuth(context)

      try {
        if (userId === id) {
          const { createReadStream, filename, mimetype } = await file

          const imageTypes = ['image/jpeg', 'image/png', 'image/gif']
          if (!imageTypes.find(i => i === mimetype)) {
            throw new UserInputError('File format not allowed')
          }

          const { ext } = path.parse(filename)
          const newFilename = id + ext

          const pathName = path.join(__dirname, '..', '..', '..', `/public/users/${newFilename}`)

          const stream = createReadStream()
          console.log(stream)
          // await sharp(stream)
          //   .resize(300, 300)
          //   .toFile(pathName)
          await stream.pipe(fs.createWriteStream(pathName))

          const url = `http://localhost:${process.env.PORT || 8000}/users/${newFilename}`

          await User.updateOne({ _id: Mongoose.Types.ObjectId(id) }, { picture: url })
          return url
        }

        throw new AuthenticationError('Action not allowed')
      } catch (err) {
        throw new Error(err)
      }
    }
  }
};

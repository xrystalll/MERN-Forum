const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server-express');

const User = require('../../models/User');
const { validateRegisterInput, validateLoginInput } = require('../../util/validators');
const checkAuth = require('../../util/checkAuth');
const generateRandomString = require('../../util/generateRandomString');

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
          users = await User.paginate({}, { sort: { onlineAt: -1 }, offset, limit })
        } else if (sort === 'admin') {
          users = await User.paginate({ role: 'admin' }, { sort: { onlineAt: -1 }, offset, limit })
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
        username,
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

    async uploadUserAvatar(_, { id, file }, context) {
      const { username } = checkAuth(context)

      const user = await User.findById(id)

      try {
        if (username === user.username) {
          console.log(file)
          const { createReadStream, filename } = await file

          const { ext } = path.parse(filename)
          const newFilename = generateRandomString(8) + ext

          const stream = createReadStream()
          const pathName = path.join(__dirname, '..', '..', '..', `/public/users/images/${newFilename}`)
          // await sharp(stream)
          //   .resize(300, 300)
          //   .toFile(pathName)
          await stream.pipe(fs.createWriteStream(pathName))

          const url = `http://localhost:${process.env.PORT || 8000}/users/images/${newFilename}`

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

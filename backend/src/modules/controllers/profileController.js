const fs = require('fs');
const path = require('path');
const { Types } = require('mongoose');
const createError = require('http-errors');
const multer = require('multer');
const sharp = require('sharp');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const Notification = require('../models/Notification');

const storage = require('../utils/storage');

const checkFileType = (file, callback) => {
  const filetypes = /jpeg|jpg|png|gif/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) return callback(null, true)
  else callback('It\'s not image', false)
}

const upload = multer({
  storage: storage('users', 'picture'),
  fileFilter: (req, file, callback) => checkFileType(file, callback),
  limits: { fileSize: 1048576 * 8 } // 8Mb
}).single('picture')

module.exports.getProfile = async (req, res, next) => {
  try {
    const select = '_id name displayName email createdAt onlineAt picture karma role ban'
    const user = await User.findOne({ _id: Types.ObjectId(req.payload.id) }, select)

    if (!user) return next(createError.BadRequest('User not found'))

    res.json(user)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.uploadUserPicture = (req, res, next) => {
  try {
    upload(req, res, (err) => {
      if (err) return next(createError.BadRequest(err.message))

      if (req.file) {
        sharp(req.file.path)
          .resize(300, 300)
          .toBuffer()
          .then(async data => {
            fs.writeFileSync(req.file.path, data)
            const picture = { picture: `/users/${req.file.filename}` }

            await User.updateOne({ _id: Types.ObjectId(req.payload.id) }, picture)

            res.json(picture)
          })
          .catch(err => {
            next(createError.InternalServerError())
          })
      } else {
        next(createError.BadRequest())
      }
    })
  } catch(err) {
    next(err)
  }
}

module.exports.editPassword = async (req, res, next) => {
  try {
    const { password, newPassword } = req.body

    if (!password) return next(createError.BadRequest('Password must not be empty'))
    if (!newPassword) return next(createError.BadRequest('newPassword must not be empty'))

    const user = await User.findOne({ _id: Types.ObjectId(req.payload.id) })

    if (!user) return next(createError.BadRequest('User not found'))

    const isMatch = await user.isValidPassword(password)
    if (!isMatch) return next(createError.BadRequest('Password not valid'))

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    await User.updateOne({ _id: Types.ObjectId(req.payload.id) }, { password: hashedPassword })

    res.json({ message: 'Password successfully changed' })
  } catch (err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.setOnline = async (req, res, next) => {
  try {
    await User.updateOne({ _id: Types.ObjectId(req.payload.id) }, { onlineAt: new Date().toISOString() })

    res.json({ success: true })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getNotifications = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, sort } = req.query

    let createdAt
    if (sort === 'old') {
      createdAt = 1
    } else {
      createdAt = -1
    }

    const populate = [{
      path: 'to',
      select: '_id name displayName onlineAt picture role ban'
    }, {
      path: 'from',
      select: '_id name displayName onlineAt picture role ban'
    }]
    const notifications = await Notification.paginate({ to: req.payload.id }, { sort: { createdAt }, page, limit, populate })

    if (notifications.totalDocs) {
      await Notification.updateMany({ to: req.payload.id, read: false }, { read: true })
    }

    res.json(notifications)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.deleteNotifications = async (req, res, next) => {
  try {
    await Notification.deleteMany({ to: req.payload.id, read: true })

    res.json({ message: 'Notifications successfully deleted' })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

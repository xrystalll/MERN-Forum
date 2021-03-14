const fs = require('fs');
const path = require('path');
const Mongoose = require('mongoose');
const createError = require('http-errors');
const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/User');
const Notification = require('../models/Notification');

const checkFileType = (file, callback) => {
  const filetypes = /jpeg|jpg|png|gif/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) return callback(null, true)
  else callback('It\'s not image', false)
}

const storage = (dest, name) => {
  return multer.diskStorage({
    destination: path.join(__dirname, '..', '..', '..', 'public', dest),
    filename: (req, file, callback) => {
      callback(null, name + '_' + Date.now() + path.extname(file.originalname))
    }
  })
}

const upload = multer({
  storage: storage('users', 'picture'),
  limits: { fileSize: 1048576 * 8 }, // 8Mb
  fileFilter: (req, file, callback) => checkFileType(file, callback)
}).single('picture')

const getProfile = async (req, res, next) => {
  try {
    const select = '_id name displayName email createdAt onlineAt picture role ban'
    const user = await User.findOne({ _id: Mongoose.Types.ObjectId(req.payload.id) }, select)

    res.json(user)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

const uploadUserPicture = (req, res, next) => {
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

            await User.updateOne({ _id: Mongoose.Types.ObjectId(req.payload.id) }, picture)

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

const setOnline = async (req, res, next) => {
  try {
    await User.updateOne({ _id: Mongoose.Types.ObjectId(req.payload.id) }, { onlineAt: new Date().toISOString() })
    res.json({ success: true })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

const getNotifications = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, sort } = req.query

    let sortCreatedAt
    if (sort === 'old') {
      sortCreatedAt = 1
    } else {
      sortCreatedAt = -1
    }

    const populate = [{
      path: 'to',
      select: '_id name displayName onlineAt picture role'
    }, {
      path: 'from',
      select: '_id name displayName onlineAt picture role'
    }]
    const notifications = await Notification.paginate({ to: req.payload.id }, { sort: { createdAt: sortCreatedAt }, page, limit, populate })

    if (notifications.totalDocs) {
      await Notification.updateMany({ to: req.payload.id, read: false }, { read: true })
    }

    res.json(notifications)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

const deleteNotifications = async (req, res, next) => {
  try {
    await Notification.deleteMany({ to: req.payload.id, read: true })

    res.json({ message: 'Notifications successfully deleted' })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports = { getProfile, uploadUserPicture, setOnline, getNotifications, deleteNotifications }

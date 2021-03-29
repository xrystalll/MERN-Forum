const path = require('path');
const { Types } = require('mongoose');
const createError = require('http-errors');
const multer = require('multer');

const Dialogue = require('../models/Dialogue');

const deleteFiles = require('../utils//deleteFiles');

const checkFileExec = (file, callback) => {
  if (
    file.mimetype === 'text/javascript' ||
    file.mimetype === 'text/html' ||
    file.mimetype === 'text/css' ||
    file.mimetype === 'application/json' ||
    file.mimetype === 'application/ld+json' ||
    file.mimetype === 'application/php'
  ) {
    callback('File format is not allowed', false)
  }
  else callback(null, true)
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
  storage: storage('message', 'file'),
  fileFilter: (req, file, callback) => checkFileExec(file, callback),
  limits: { fields: 1, fileSize: 1048576 * 42 } // 42Mb
}).array('file', 4)

module.exports.getDialogues = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query

    const populate = [{
      path: 'from',
      select: '_id name displayName onlineAt picture role'
    }, {
      path: 'lastMessage'
    }]
    const messages = await Dialogue.paginate({
      $or: [{
        to: Types.ObjectId(req.payload.id)
      }, {
        from: Types.ObjectId(req.payload.id)
      }]
    }, {
      sort: { createdAt: -1 },
      page,
      limit,
      populate
    })

    res.json(messages)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

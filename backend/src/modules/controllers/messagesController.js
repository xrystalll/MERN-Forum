const path = require('path');
const { Types } = require('mongoose');
const createError = require('http-errors');
const multer = require('multer');

const User = require('../models/User');
const Dialogue = require('../models/Dialogue');
const Message = require('../models/Message');

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
    const dialogues = await Dialogue.paginate({
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

    if (dialogues.length) {
      if (req.payload.id !== dialogues[0].to) return next(createError.Unauthorized('Action not allowed'))
    }

    res.json(dialogues)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getDialogue = async (req, res, next) => {
  try {
    const { userName } = req.query

    if (!userName) return next(createError.BadRequest('userName must not be empty'))

    const user = await User.findOne({ name: userName })

    const dialogue = await Dialogue.findOne({
      $or: [{
        to: Types.ObjectId(user._id)
      }, {
        from: Types.ObjectId(user._id)
      }]
    })

    // if (req.payload.id !== dialogue.to.toString() || req.payload.id !== dialogue.from.toString()) {
    //   return next(createError.Unauthorized('Action not allowed'))
    // }

    res.json(dialogue)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getMessages = async (req, res, next) => {
  try {
    const { dialogueId, limit = 10, page = 1 } = req.query

    if (!dialogueId) return next(createError.BadRequest('dialogueId must not be empty'))

    const populate = [{
      path: 'from',
      select: '_id name displayName onlineAt picture role'
    }, {
      path: 'to',
      select: '_id name displayName onlineAt picture role'
    }]
    const messages = await Message.paginate({ dialogueId }, { sort: { createdAt: -1 }, page, limit, populate })

    res.json(messages)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

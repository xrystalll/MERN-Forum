const fs = require('fs');
const path = require('path');
const Mongoose = require('mongoose');
const createError = require('http-errors');
const multer = require('multer');

const Folder = require('../models/Folder');
const File = require('../models/File');

const deleteFiles = require('../utils//deleteFiles');

const storage = (dest, name) => {
  return multer.diskStorage({
    destination: path.join(__dirname, '..', '..', '..', 'public', dest),
    filename: (req, file, callback) => {
      callback(null, name + '_' + Date.now() + path.extname(file.originalname))
    }
  })
}

const upload = multer({
  storage: storage('uploads', 'file'),
  limits: { fields: 1, fileSize: 1048576 * 80 } // 80Mb
}).single('file')

module.exports.getFolders = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, pagination = true } = req.query

    const folders = await Folder.paginate({}, { sort: { position: -1 }, page, limit, pagination: JSON.parse(pagination) })

    res.json(folders)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getFolder = async (req, res, next) => {
  try {
    const { name, folderId } = req.query

    let folder
    if (name) {
      folder = await Folder.findOne({ name })
    } else if (folderId) {
      folder = await Folder.findById(folderId)
    } else {
      return next(createError.BadRequest('Folder name or folderId must not be empty'))
    }

    res.json(folder)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.createFolder = async (req, res, next) => {
  try {
    const { name, title, body, position } = req.body
    const admin = req.payload.role === 'admin'

    if (!admin) return next(createError.Unauthorized('Action not allowed'))
    if (name.trim() === '') return next(createError.BadRequest('Folder name must not be empty'))
    if (title.trim() === '') return next(createError.BadRequest('Folder title must not be empty'))
    if (!position || !Number.isInteger(position) || position < 0) return next(createError.BadRequest('Position must be number'))

    const nameUrl = name.trim().toLowerCase().substring(0, 12).replace(/[^a-z0-9-_]/g, '')

    const nameExist = await Folder.findOne({ name: nameUrl })
    if (nameExist) return next(createError.Conflict('Folder with this short name is already been created'))

    const newFolder = new Folder({
      name: nameUrl,
      title: title.trim().substring(0, 21),
      body: body.substring(0, 100),
      position,
      createdAt: new Date().toISOString(),
      filesCount: 0
    })

    const folder = await newFolder.save()

    res.json(folder)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.deleteFolder = async (req, res, next) => {
  try {
    const { folderId } = req.body
    const admin = req.payload.role === 'admin'

    if (!admin) return next(createError.Unauthorized('Action not allowed'))
    if (!folderId) return next(createError.BadRequest('folderId must not be empty'))

    const folder = await Folder.findById(folderId)
    await folder.delete()

    res.json({ message: 'Folder successfully deleted' })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.editFolder = async (req, res, next) => {
  try {
    const { folderId, name, title, body, position } = req.body
    const admin = req.payload.role === 'admin'

    if (!admin) return next(createError.Unauthorized('Action not allowed'))
    if (!folderId) return next(createError.BadRequest('folderId must not be empty'))
    if (name.trim() === '') return next(createError.BadRequest('Folder name must not be empty'))
    if (title.trim() === '') return next(createError.BadRequest('Folder title must not be empty'))
    if (!position || !Number.isInteger(position) || position < 0) return next(createError.BadRequest('Position must be number'))

    const nameUrl = name.trim().toLowerCase().substring(0, 12).replace(/[^a-z0-9-_]/g, '')

    const nameExist = await Folder.findOne({ name: nameUrl })
    if (nameExist) return next(createError.Conflict('Folder with this short name is already been created'))

    await Folder.updateOne({ _id: Mongoose.Types.ObjectId(folderId) }, {
      name: nameUrl,
      title: title.trim().substring(0, 21),
      body: body.substring(0, 100),
      position
    })
    const folder = await Folder.findById(folderId)

    res.json(folder)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getAdminAllFiles = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, sort } = req.query
    const admin = req.payload.role === 'admin'

    if (!admin) return next(createError.Unauthorized('Action not allowed'))

    const populate = [{
      path: 'author',
      select: '_id name displayName onlineAt picture role'
    }, {
      path: 'likes',
      select: '_id name displayName picture'
    }]
    const moderated = sort === 'moderated' ? { moderated: true } : { moderated: false }
    const files = await File.paginate(moderated, { sort: { createdAt: -1 }, page, limit, populate })

    res.json(files)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getAllFiles = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query

    const populate = [{
      path: 'author',
      select: '_id name displayName onlineAt picture role'
    }, {
      path: 'likes',
      select: '_id name displayName picture'
    }]
    const files = await File.paginate({ moderated: true }, { sort: { createdAt: -1 }, page, limit, populate })

    res.json(files)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getFiles = async (req, res, next) => {
  try {
    const { folderId, limit = 10, page = 1 } = req.query

    if (!folderId) return next(createError.BadRequest('folderId must not be empty'))

    const populate = [{
      path: 'author',
      select: '_id name displayName onlineAt picture role'
    }, {
      path: 'likes',
      select: '_id name displayName picture'
    }]
    const files = await File.paginate({ folderId, moderated: true }, { sort: { createdAt: -1 }, page, limit, populate })

    res.json(files)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getFile = async (req, res, next) => {
  try {
    const { fileId } = req.query

    if (!fileId) return next(createError.BadRequest('fileId must not be empty'))

    const populate = [{
      path: 'author',
      select: '_id name displayName onlineAt picture role ban'
    }, {
      path: 'likes',
      select: '_id name displayName picture'
    }]
    const file = await File.findById(fileId).populate(populate)

    if (!file.moderated) return next(createError.BadRequest('File not modarated'))

    const folder = await Folder.findById(file.folderId).select('_id name title')

    res.json({ folder, file })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.createFile = async (req, res, next) => {
  try {
    upload(req, res, async (err) => {
      if (err) return next(createError.BadRequest(err.message))

      const { folderId, title, body } = JSON.parse(req.body.postData)

      if (!folderId) return next(createError.BadRequest('folderId must not be empty'))
      if (title.trim() === '') return next(createError.BadRequest('File title must not be empty'))
      if (body.trim() === '') return next(createError.BadRequest('File body must not be empty'))

      const now = new Date().toISOString()

      const newFile = new File({
        folderId,
        title: title.trim().substring(0, 100),
        body: body.substring(0, 1000),
        createdAt: now,
        author: req.payload.id,
        file: {
          url: `/uploads/${req.file.filename}`,
          type: req.file.mimetype,
          size: req.file.size
        },
        downloads: 0,
        moderated: false
      })

      const file = await newFile.save()

      await Folder.updateOne({ _id: Mongoose.Types.ObjectId(folderId) }, { $inc: { filesCount: 1 } })

      res.json(file)

      req.io.to('adminNotification').emit('newAdminNotification', { type: 'file' })
    })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.deleteFile = async (req, res, next) => {
  try {
    const { fileId } = req.body
    const admin = req.payload.role === 'admin'

    if (!admin) return next(createError.Unauthorized('Action not allowed'))
    if (!fileId) return next(createError.BadRequest('fileId must not be empty'))

    const file = await File.findById(fileId)

    const fileUri = path.join(__dirname, '..', '..', '..', 'public', 'uploads', path.basename(file.file.url))
    deleteFiles([fileUri], (err) => {
      if (err) console.error(err)
    })

    await file.delete()

    await Folder.updateOne({ _id: Mongoose.Types.ObjectId(file.folderId) }, { $inc: { filesCount: -1 } })

    res.json({ message: 'File successfully deleted' })

    req.io.to('file:' + fileId).emit('fileDeleted', { id: fileId })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.editFile = async (req, res, next) => {
  try {
    upload(req, res, async (err) => {
      if (err) return next(createError.BadRequest(err.message))

      const { fileId, title, body } = JSON.parse(req.body.postData)
      const admin = req.payload.role === 'admin'

      if (!fileId) return next(createError.BadRequest('fileId must not be empty'))
      if (title.trim() === '') return next(createError.BadRequest('File title must not be empty'))
      if (body.trim() === '') return next(createError.BadRequest('File body must not be empty'))

      const file = await File.findById(fileId)

      if (req.payload.id !== file.author.toString() || !admin) return next(createError.Unauthorized('Action not allowed'))

      if (req.file) {
        const fileUri = path.join(__dirname, '..', '..', '..', 'public', 'uploads', path.basename(file.file.url))
        deleteFiles([fileUri], (err) => {
          if (err) console.error(err)
        })
      }

      let fileObj = file.file
      if (req.file) {
        fileObj = {
          url: `/uploads/${req.file.filename}`,
          type: req.file.mimetype,
          size: req.file.size
        }
      }

      await File.updateOne({ _id: Mongoose.Types.ObjectId(fileId) }, {
        title: title.trim().substring(0, 100),
        body: body.substring(0, 1000),
        file: fileObj
      })

      const populate = [{
        path: 'author',
        select: '_id name displayName onlineAt picture role ban'
      }, {
        path: 'likes',
        select: '_id name displayName picture'
      }]
      const editedFile = await File.findById(fileId).populate(populate)

      res.json(editedFile)

      req.io.to('file:' + fileId).emit('fileEdited', editedFile)
    })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.likeFile = async (req, res, next) => {
  try {
    const { fileId } = req.body

    if (!fileId) return next(createError.BadRequest('fileId must not be empty'))

    const file = await File.findById(fileId)

    if (file.likes.find(like => like.toString() === req.payload.id)) {
      file.likes = file.likes.filter(like => like.toString() !== req.payload.id) // unlike
    } else {
      file.likes.push(req.payload.id) // like
    }
    await file.save()

    const populate = [{
      path: 'author',
      select: '_id name displayName onlineAt picture role ban'
    }, {
      path: 'likes',
      select: '_id name displayName picture'
    }]
    const likedFile = await File.findById(fileId).populate(populate)

    res.json(likedFile)

    req.io.to('file:' + fileId).emit('fileLiked', likedFile)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.moderateFile = async (req, res, next) => {
  try {
    const { fileId } = req.query
    const admin = req.payload.role === 'admin'

    if (!admin) return next(createError.Unauthorized('Action not allowed'))
    if (!fileId) return next(createError.BadRequest('fileId must not be empty'))

    await File.updateOne({ _id: Mongoose.Types.ObjectId(fileId) }, { moderated: true })

    res.json({ message: 'File successfully moderated' })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

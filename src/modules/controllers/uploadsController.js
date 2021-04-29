const path = require('path');
const { Types } = require('mongoose');
const createError = require('http-errors');
const multer = require('multer');

const User = require('../models/User');
const Folder = require('../models/Folder');
const File = require('../models/File');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');

const deleteFiles = require('../utils//deleteFiles');
const { checkFileExec, videoTypes } = require('../utils/checkFileExec');
const storage = require('../utils/storage');
const createThumb = require('../utils/createThumbnail');

const upload = multer({
  storage: storage('uploads', 'file'),
  fileFilter: (req, file, callback) => checkFileExec(file, callback),
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
    const admin = req.payload.role === 3

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
    const admin = req.payload.role === 3

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
    const admin = req.payload.role === 3

    if (!admin) return next(createError.Unauthorized('Action not allowed'))
    if (!folderId) return next(createError.BadRequest('folderId must not be empty'))
    if (name.trim() === '') return next(createError.BadRequest('Folder name must not be empty'))
    if (title.trim() === '') return next(createError.BadRequest('Folder title must not be empty'))
    if (!position || !Number.isInteger(position) || position < 0) return next(createError.BadRequest('Position must be number'))

    const nameUrl = name.trim().toLowerCase().substring(0, 12).replace(/[^a-z0-9-_]/g, '')

    const nameExist = await Folder.findOne({ name: nameUrl })
    if (nameExist) return next(createError.Conflict('Folder with this short name is already been created'))

    await Folder.updateOne({ _id: Types.ObjectId(folderId) }, {
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
    const moder = req.payload.role >= 2

    if (!moder) return next(createError.Unauthorized('Action not allowed'))

    const populate = [{
      path: 'author',
      select: '_id name displayName onlineAt picture role ban'
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
      select: '_id name displayName onlineAt picture role ban'
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
      select: '_id name displayName onlineAt picture role ban'
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

    const folder = await Folder.findById(file.folderId).select('_id name title')

    if (!file.moderated) return res.json({ folder, message: 'File on moderation' })

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

      let thumb = null
      if (videoTypes.find(i => i === req.file.mimetype)) {
        const thumbFilename = req.file.filename.replace(path.extname(req.file.filename), '.jpg')

        await createThumb(req.file.path, 'uploads', thumbFilename)

        thumb = `/uploads/thumbnails/${thumbFilename}`
      }

      const newFile = new File({
        folderId,
        title: title.trim().substring(0, 100),
        body: body.substring(0, 1000),
        createdAt: now,
        author: req.payload.id,
        file: {
          url: `/uploads/${req.file.filename}`,
          thumb,
          type: req.file.mimetype,
          size: req.file.size
        },
        downloads: 0,
        commentsCount: 0,
        moderated: false
      })

      const file = await newFile.save()

      await Folder.updateOne({ _id: Types.ObjectId(file.folderId) }, { $inc: { filesCount: 1 } })

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
    const moder = req.payload.role >= 2

    if (!moder) return next(createError.Unauthorized('Action not allowed'))
    if (!fileId) return next(createError.BadRequest('fileId must not be empty'))

    const file = await File.findById(fileId).populate({ path: 'author', select: 'role' })

    if (!file.author) {
      file.author = {
        role: 1
      }
    }
    if (req.payload.role < file.author.role) return next(createError.Unauthorized('Action not allowed'))

    const deleteArray = []
    deleteArray.push(path.join(__dirname, '..', '..', '..', 'public', 'uploads', path.basename(file.file.url)))
    if (file.file.thumb) {
      deleteArray.push(path.join(__dirname, '..', '..', '..', 'public', 'uploads', 'thumbnails', path.basename(file.file.thumb)))
    }

    deleteFiles(deleteArray, (err) => {
      if (err) console.error(err)
    })

    await file.delete()

    await Comment.deleteMany({ fileId })
    await Folder.updateOne({ _id: Types.ObjectId(file.folderId) }, { $inc: { filesCount: -1 } })

    res.json({ message: 'File successfully deleted' })

    req.io.to('file:' + fileId).emit('fileDeleted', { id: fileId })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.editFile = async (req, res, next) => {
  try {
    const { fileId, title, body } = req.body

    if (!fileId) return next(createError.BadRequest('fileId must not be empty'))
    if (title.trim() === '') return next(createError.BadRequest('File title must not be empty'))
    if (body.trim() === '') return next(createError.BadRequest('File body must not be empty'))

    const file = await File.findById(fileId).populate({ path: 'author', select: 'role' })

    if (!file.author) {
      file.author = {
        role: 1
      }
    }
    if (req.payload.id !== file.author._id) {
      if (req.payload.role < file.author.role) {
        return next(createError.Unauthorized('Action not allowed'))
      }
    }

    await File.updateOne({ _id: Types.ObjectId(fileId) }, {
      title: title.trim().substring(0, 100),
      body: body.substring(0, 1000)
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
    const { fileId } = req.body
    const moder = req.payload.role >= 2

    if (!moder) return next(createError.Unauthorized('Action not allowed'))
    if (!fileId) return next(createError.BadRequest('fileId must not be empty'))

    await File.updateOne({ _id: Types.ObjectId(fileId) }, { moderated: true })

    const file = File.findById(fileId)

    await User.updateOne({ _id: Types.ObjectId(file.author) }, { $inc: { karma: 3 } })

    res.json({ message: 'File successfully moderated' })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.download = async (req, res, next) => {
  try {
    const { fileId } = req.body

    if (!fileId) return next(createError.BadRequest('fileId must not be empty'))

    await File.updateOne({ _id: Types.ObjectId(fileId) }, { $inc: { downloads: 1 } })

    const populate = [{
      path: 'author',
      select: '_id name displayName onlineAt picture role ban'
    }, {
      path: 'likes',
      select: '_id name displayName picture'
    }]
    const file = await File.findById(fileId).populate(populate)

    res.json(file)

    req.io.to('file:' + fileId).emit('fileDownloaded', file)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getComments = async (req, res, next) => {
  try {
    const { fileId, limit = 10, page = 1, pagination = true } = req.query

    if (!fileId) return next(createError.BadRequest('fileId must not be empty'))

    const populate = [{
      path: 'author',
      select: '_id name displayName onlineAt picture role ban'
    }, {
      path: 'likes',
      select: '_id name displayName picture'
    }]
    const comments = await Comment.paginate({ fileId }, { page, limit, populate, pagination: JSON.parse(pagination) })

    res.json(comments)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.createComment = async (req, res, next) => {
  try {
    const { fileId, commentedTo, body } = req.body

    if (!fileId) return next(createError.BadRequest('fileId must not be empty'))
    if (body.trim() === '') return next(createError.BadRequest('Comment body must not be empty'))

    const now = new Date().toISOString()

    const file = await File.findById(fileId)

    const newComment = new Comment({
      fileId,
      commentedTo,
      body: body.substring(0, 1000),
      createdAt: now,
      author: req.payload.id
    })

    const comment = await newComment.save()

    await File.updateOne({ _id: Types.ObjectId(fileId) }, { $inc: { commentsCount: 1 } })

    const populate = [{
      path: 'author',
      select: '_id name displayName onlineAt picture role ban'
    }, {
      path: 'likes',
      select: '_id name displayName picture'
    }]
    const populatedComment = await Comment.findById(comment._id).populate(populate)

    await User.updateOne({ _id: Types.ObjectId(req.payload.id) }, {
      $inc: {
        karma: populatedComment.author._id === req.payload.id ? 1 : 2
      }
    })

    res.json(populatedComment)

    req.io.to('file:' + fileId).emit('commentCreated', populatedComment)

    let type = 'commentToFile'
    let to = file.author
    if (commentedTo && commentedTo !== fileId) {
      const commentTo = await Comment.findById(commentedTo)
      type = 'commentToComment'
      to = commentTo.author
    }

    if (!commentedTo && req.payload.id === file.author.toString()) return

    const newNotification = new Notification({
      type,
      to,
      from: req.payload.id,
      pageId: fileId,
      title: file.title,
      body: body.substring(0, 1000),
      createdAt: new Date().toISOString(),
      read: false
    })
    const notification = await newNotification.save()

    const populateNotification = [{
      path: 'to',
      select: '_id name displayName onlineAt picture role ban'
    }, {
      path: 'from',
      select: '_id name displayName onlineAt picture role ban'
    }]
    const populatedNotification = await Notification.findById(notification._id).populate(populateNotification)

    req.io.to('notification:' + to).emit('newNotification', populatedNotification)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.body

    if (!commentId) return next(createError.BadRequest('commentId must not be empty'))

    const comment = await Comment.findById(commentId).populate({ path: 'author', select: 'role' })

    if (!comment.author) {
      comment.author = {
        role: 1
      }
    }
    if (req.payload.id === comment.author._id || req.payload.role >= comment.author.role) {
      await comment.delete()

      await File.updateOne({ _id: Types.ObjectId(comment.fileId) }, { $inc: { commentsCount: -1 } })

      res.json({ message: 'Comment successfully deleted' })

      req.io.to('file:' + comment.fileId).emit('commentDeleted', { id: commentId })
    } else {
      return next(createError.Unauthorized('Action not allowed'))
    }
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.likeComment = async (req, res, next) => {
  try {
    const { commentId } = req.body

    if (!commentId) return next(createError.BadRequest('commentId must not be empty'))

    const comment = await Comment.findById(commentId)

    if (comment.likes.find(like => like.toString() === req.payload.id)) {
      comment.likes = comment.likes.filter(like => like.toString() !== req.payload.id) // unlike
    } else {
      comment.likes.push(req.payload.id) // like
    }
    await comment.save()

    const populate = [{
      path: 'author',
      select: '_id name displayName onlineAt picture role ban'
    }, {
      path: 'likes',
      select: '_id name displayName picture'
    }]
    const likedComment = await Comment.findById(commentId).populate(populate)

    res.json(likedComment)

    req.io.to('file:' + comment.fileId).emit('commentLiked', likeComment)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

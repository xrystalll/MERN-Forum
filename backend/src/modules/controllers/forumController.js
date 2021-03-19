const fs = require('fs');
const path = require('path');
const Mongoose = require('mongoose');
const createError = require('http-errors');
const multer = require('multer');

const Board = require('../models/Board');
const Thread = require('../models/Thread');
const Answer = require('../models/Answer');
const Notification = require('../models/Notification');

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
  storage: storage('forum', 'attach'),
  fileFilter: (req, file, callback) => checkFileExec(file, callback),
  limits: { fields: 1, fileSize: 1048576 * 12 } // 12Mb
}).array('attach', 4)

module.exports.getBoards = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, sort, pagination = true } = req.query

    let boards
    if (sort === 'popular') {
      boards = await Board.paginate({}, { sort: { threadsCount: -1 }, page, limit, pagination: JSON.parse(pagination) })
    } else if (sort === 'answersCount') {
      boards = await Board.paginate({}, { sort: { answersCount: -1 }, page, limit, pagination: JSON.parse(pagination) })
    } else if (sort === 'newestThread') {
      boards = await Board.paginate({}, { sort: { newestThread: -1 }, page, limit, pagination: JSON.parse(pagination) })
    } else if (sort === 'newestAnswer') {
      boards = await Board.paginate({}, { sort: { newestAnswer: -1 }, page, limit, pagination: JSON.parse(pagination) })
    } else {
      boards = await Board.paginate({}, { sort: { position: -1 }, page, limit, pagination: JSON.parse(pagination) })
    }

    res.json(boards)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getBoard = async (req, res, next) => {
  try {
    const { name, boardId } = req.query

    let board
    if (name) {
      board = await Board.findOne({ name })
    } else if (boardId) {
      board = await Board.findById(boardId)
    } else {
      return next(createError.BadRequest('Board name or boardId must not be empty'))
    }

    res.json(board)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.createBoard = async (req, res, next) => {
  try {
    const { name, title, body, position } = req.body
    const admin = req.payload.role === 'admin'

    if (!admin) return next(createError.Unauthorized('Action not allowed'))
    if (name.trim() === '') return next(createError.BadRequest('Board name must not be empty'))
    if (title.trim() === '') return next(createError.BadRequest('Board title must not be empty'))
    if (!position || !Number.isInteger(position) || position < 0) return next(createError.BadRequest('Position must be number'))

    const nameUrl = name.trim().toLowerCase().substring(0, 12).replace(/[^a-z0-9-_]/g, '')

    const nameExist = await Board.findOne({ name: nameUrl })
    if (nameExist) return next(createError.Conflict('Board with this short name is already been created'))

    const newBoard = new Board({
      name: nameUrl,
      title: title.trim().substring(0, 21),
      body: body.substring(0, 100),
      position,
      createdAt: new Date().toISOString(),
      threadsCount: 0,
      answersCount: 0
    })

    const board = await newBoard.save()

    res.json(board)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.deleteBoard = async (req, res, next) => {
  try {
    const { boardId } = req.body
    const admin = req.payload.role === 'admin'

    if (!admin) return next(createError.Unauthorized('Action not allowed'))
    if (!boardId) return next(createError.BadRequest('boardId must not be empty'))

    const board = await Board.findById(boardId)
    await board.delete()

    res.json({ message: 'Board successfully deleted' })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.editBoard = async (req, res, next) => {
  try {
    const { boardId, name, title, body, position } = req.body
    const admin = req.payload.role === 'admin'

    if (!admin) return next(createError.Unauthorized('Action not allowed'))
    if (!boardId) return next(createError.BadRequest('boardId must not be empty'))
    if (name.trim() === '') return next(createError.BadRequest('Board name must not be empty'))
    if (title.trim() === '') return next(createError.BadRequest('Board title must not be empty'))
    if (!position || !Number.isInteger(position) || position < 0) return next(createError.BadRequest('Position must be number'))

    const nameUrl = name.trim().toLowerCase().substring(0, 12).replace(/[^a-z0-9-_]/g, '')

    const nameExist = await Board.findOne({ name: nameUrl })
    if (nameExist) return next(createError.Conflict('Board with this short name is already been created'))

    await Board.updateOne({ _id: Mongoose.Types.ObjectId(boardId) }, {
      name: nameUrl,
      title: title.trim().substring(0, 21),
      body: body.substring(0, 100),
      position
    })
    const board = await Board.findById(boardId)

    res.json(board)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getRecentlyThreads = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query

    const populate = [{
      path: 'author',
      select: '_id name displayName onlineAt picture role'
    }, {
      path: 'likes',
      select: '_id name displayName picture'
    }]
    const threads = await Thread.paginate({}, { sort: { pined: -1, newestAnswer: -1, createdAt: -1 }, page, limit, populate })

    res.json(threads)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getThreads = async (req, res, next) => {
  try {
    const { boardId, limit = 10, page = 1, sort } = req.query

    if (!boardId) return next(createError.BadRequest('boardId must not be empty'))

    const populate = [{
      path: 'author',
      select: '_id name displayName onlineAt picture role'
    }, {
      path: 'likes',
      select: '_id name displayName picture'
    }]
    let threads
    if (sort === 'answersCount') {
      threads = await Thread.paginate({ boardId }, { sort: { pined: -1, answersCount: -1 }, page, limit, populate })
    } else if (sort === 'newestAnswer') {
      threads = await Thread.paginate({ boardId }, { sort: { pined: -1, newestAnswer: -1 }, page, limit, populate })
    } else {
      threads = await Thread.paginate({ boardId }, { sort: { pined: -1, createdAt: -1 }, page, limit, populate })
    }

    res.json(threads)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getThread = async (req, res, next) => {
  try {
    const { threadId } = req.query

    if (!threadId) return next(createError.BadRequest('threadId must not be empty'))

    const populate = [{
      path: 'author',
      select: '_id name displayName onlineAt picture role ban'
    }, {
      path: 'likes',
      select: '_id name displayName picture'
    }]
    const thread = await Thread.findById(threadId).populate(populate)
    const board = await Board.findById(thread.boardId).select('_id name title')

    res.json({ board, thread })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.createThread = async (req, res, next) => {
  try {
    upload(req, res, async (err) => {
      if (err) return next(createError.BadRequest(err.message))

      const { boardId, title, body } = JSON.parse(req.body.postData)

      if (!boardId) return next(createError.BadRequest('boardId must not be empty'))
      if (title.trim() === '') return next(createError.BadRequest('Thread title must not be empty'))
      if (body.trim() === '') return next(createError.BadRequest('Thread body must not be empty'))

      const now = new Date().toISOString()

      let files = null
      if (req.files.length) {
        files = req.files.reduce((array, item) => [...array, {
          file: `/forum/${item.filename}`,
          type: item.mimetype,
          size: item.size
        }], [])
      }

      const newThread = new Thread({
        boardId,
        pined: false,
        closed: false,
        title: title.trim().substring(0, 100),
        body: body.substring(0, 1000),
        createdAt: now,
        author: req.payload.id,
        newestAnswer: now,
        attach: files
      })

      const thread = await newThread.save()

      await Board.updateOne({ _id: Mongoose.Types.ObjectId(boardId) }, { $inc: { threadsCount: 1 }, newestThread: now })

      res.json(thread)
    })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.deleteThread = async (req, res, next) => {
  try {
    const { threadId } = req.body
    const admin = req.payload.role === 'admin'

    if (!admin) return next(createError.Unauthorized('Action not allowed'))
    if (!threadId) return next(createError.BadRequest('threadId must not be empty'))

    const thread = await Thread.findById(threadId)

    if (thread.attach && thread.attach.length) {
      const files = thread.attach.reduce((array, item) => [
        ...array,
        path.join(__dirname, '..', '..', '..', 'public', 'forum', path.basename(item.file))
      ], [])

      deleteFiles(files, (err) => {
        if (err) console.error(err)
      })
    }

    await thread.delete()

    const deletedAnswers = await Answer.deleteMany({ threadId })
    await Board.updateOne({ _id: Mongoose.Types.ObjectId(thread.boardId) }, {
      $inc: {
        threadsCount: -1,
        answersCount: -deletedAnswers.deletedCount
      }
    })

    res.json({ message: 'Thread successfully deleted' })

    req.io.to('thread:' + threadId).emit('threadDeleted', { id: threadId })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.editThread = async (req, res, next) => {
  try {
    upload(req, res, async (err) => {
      if (err) return next(createError.BadRequest(err.message))

      const { threadId, title, body, closed } = JSON.parse(req.body.postData)

      if (!threadId) return next(createError.BadRequest('threadId must not be empty'))
      if (title.trim() === '') return next(createError.BadRequest('Thread title must not be empty'))
      if (body.trim() === '') return next(createError.BadRequest('Thread body must not be empty'))

      const thread = await Thread.findById(threadId)

      if (req.payload.id !== thread.author.toString()) return next(createError.Unauthorized('Action not allowed'))

      if (req.files.length && thread.attach && thread.attach.length) {
        const files = thread.attach.reduce((array, item) => [
          ...array,
          path.join(__dirname, '..', '..', '..', 'public', 'forum', path.basename(item.file))
        ], [])

        deleteFiles(files, (err) => {
          if (err) console.error(err)
        })
      }

      let files = thread.attach
      if (req.files.length) {
        files = req.files.reduce((array, item) => [...array, {
          file: `/forum/${item.filename}`,
          type: item.mimetype,
          size: item.size
        }], [])
      }

      const obj = {
        title: title.trim().substring(0, 100),
        body: body.substring(0, 1000),
        closed: closed === undefined ? thread.closed : closed,
        attach: files
      }
      if (closed === undefined) {
        obj.edited = {
          createdAt: new Date().toISOString()
        }
      }

      await Thread.updateOne({ _id: Mongoose.Types.ObjectId(threadId) }, obj)

      const populate = [{
        path: 'author',
        select: '_id name displayName onlineAt picture role ban'
      }, {
        path: 'likes',
        select: '_id name displayName picture'
      }]
      const editedThread = await Thread.findById(threadId).populate(populate)

      res.json(editedThread)

      req.io.to('thread:' + threadId).emit('threadEdited', editedThread)
    })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.adminEditThread = async (req, res, next) => {
  try {
    upload(req, res, async (err) => {
      if (err) return next(createError.BadRequest(err.message))

      const { threadId, title, body, pined, closed } = JSON.parse(req.body.postData)
      const admin = req.payload.role === 'admin'

      if (!admin) return next(createError.Unauthorized('Action not allowed'))
      if (!threadId) return next(createError.BadRequest('threadId must not be empty'))
      if (title.trim() === '') return next(createError.BadRequest('Board title must not be empty'))
      if (body.trim() === '') return next(createError.BadRequest('Thread body must not be empty'))

      const thread = await Thread.findById(threadId)

      if (req.files.length && thread.attach && thread.attach.length) {
        const files = thread.attach.reduce((array, item) => [
          ...array,
          path.join(__dirname, '..', '..', '..', 'public', 'forum', path.basename(item.file))
        ], [])

        deleteFiles(files, (err) => {
          if (err) console.error(err)
        })
      }

      let files = thread.attach
      if (req.files.length) {
        files = req.files.reduce((array, item) => [...array, {
          file: `/forum/${item.filename}`,
          type: item.mimetype,
          size: item.size
        }], [])
      }

      const obj = {
        title: title.trim().substring(0, 100),
        body: body.substring(0, 1000),
        pined: pined === undefined ? thread.pined : pined,
        closed: closed === undefined ? thread.closed : closed,
        attach: files
      }
      if (pined === undefined && closed === undefined) {
        obj.edited = {
          createdAt: new Date().toISOString()
        }
      }

      await Thread.updateOne({ _id: Mongoose.Types.ObjectId(threadId) }, obj)

      const populate = [{
        path: 'author',
        select: '_id name displayName onlineAt picture role ban'
      }, {
        path: 'likes',
        select: '_id name displayName picture'
      }]
      const editedThread = await Thread.findById(threadId).populate(populate)

      res.json(editedThread)

      req.io.to('thread:' + threadId).emit('threadEdited', editedThread)
    })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.likeThread = async (req, res, next) => {
  try {
    const { threadId } = req.body

    if (!threadId) return next(createError.BadRequest('threadId must not be empty'))

    const thread = await Thread.findById(threadId)

    if (thread.likes.find(like => like.toString() === req.payload.id)) {
      thread.likes = thread.likes.filter(like => like.toString() !== req.payload.id) // unlike
    } else {
      thread.likes.push(req.payload.id) // like
    }
    await thread.save()

    const populate = [{
      path: 'author',
      select: '_id name displayName onlineAt picture role ban'
    }, {
      path: 'likes',
      select: '_id name displayName picture'
    }]
    const likedThread = await Thread.findById(threadId).populate(populate)

    res.json(likedThread)

    req.io.to('thread:' + threadId).emit('threadLiked', likedThread)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getAnswers = async (req, res, next) => {
  try {
    const { threadId, limit = 10, page = 1, pagination = true } = req.query

    if (!threadId) return next(createError.BadRequest('threadId must not be empty'))

    const populate = [{
      path: 'author',
      select: '_id name displayName onlineAt picture role ban'
    }, {
      path: 'likes',
      select: '_id name displayName picture'
    }]
    const answers = await Answer.paginate({ threadId }, { page, limit, populate, pagination: JSON.parse(pagination) })

    res.json(answers)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.createAnswer = async (req, res, next) => {
  try {
    upload(req, res, async (err) => {
      if (err) return next(createError.BadRequest(err.message))

      const { threadId, answeredTo, body } = JSON.parse(req.body.postData)

      if (!threadId) return next(createError.BadRequest('threadId must not be empty'))
      if (body.trim() === '') return next(createError.BadRequest('Answer body must not be empty'))

      const now = new Date().toISOString()

      const thread = await Thread.findById(threadId)

      let files = null
      if (req.files.length) {
        files = req.files.reduce((array, item) => [...array, {
          file: `/forum/${item.filename}`,
          type: item.mimetype,
          size: item.size
        }], [])
      }

      const newAnswer = new Answer({
        boardId: thread.boardId,
        threadId,
        answeredTo,
        body: body.substring(0, 1000),
        createdAt: now,
        author: req.payload.id,
        attach: files
      })

      const answer = await newAnswer.save()

      await Board.updateOne({ _id: Mongoose.Types.ObjectId(thread.boardId) }, { $inc: { answersCount: 1 }, newestAnswer: now })
      await Thread.updateOne({ _id: Mongoose.Types.ObjectId(threadId) }, { $inc: { answersCount: 1 }, newestAnswer: now })

      const populate = [{
        path: 'author',
        select: '_id name displayName onlineAt picture role ban'
      }, {
        path: 'likes',
        select: '_id name displayName picture'
      }]
      const populatedAnswer = await Answer.findById(answer._id).populate(populate)

      res.json(populatedAnswer)

      req.io.to('thread:' + threadId).emit('answerCreated', populatedAnswer)

      let type = 'answerToThread'
      let to = null
      if (answeredTo === threadId || !answeredTo) {
        type = 'answerToThread'
        to = thread.author
      } else {
        const answerTo = await Answer.findById(answeredTo)
        type = 'answerToAnswer'
        to = answerTo.author
      }

      if (req.payload.id !== thread.author.toString()) {
        const newNotification = new Notification({
          type,
          to,
          from: req.payload.id,
          threadId,
          title: thread.title,
          body: body.substring(0, 1000),
          createdAt: new Date().toISOString(),
          read: false
        })
        const notification = await newNotification.save()

        const populate = [{
          path: 'to',
          select: '_id name displayName onlineAt picture role'
        }, {
          path: 'from',
          select: '_id name displayName onlineAt picture role'
        }]
        const populatedNotification = await Notification.findById(notification._id).populate(populate)

        req.io.to('notification:' + to).emit('newNotification', populatedNotification)
      }
    })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.deleteAnswer = async (req, res, next) => {
  try {
    const { answerId } = req.body
    const admin = req.payload.role === 'admin'

    if (!admin) return next(createError.Unauthorized('Action not allowed'))
    if (!answerId) return next(createError.BadRequest('answerId must not be empty'))

    const answer = await Answer.findById(answerId)

    if (answer.attach && answer.attach.length) {
      const files = answer.attach.reduce((array, item) => [
        ...array,
        path.join(__dirname, '..', '..', '..', 'public', 'forum', path.basename(item.file))
      ], [])

      deleteFiles(files, (err) => {
        if (err) console.error(err)
      })
    }

    await answer.delete()

    await Board.updateOne({ _id: Mongoose.Types.ObjectId(answer.boardId) }, { $inc: { answersCount: -1 } })
    await Thread.updateOne({ _id: Mongoose.Types.ObjectId(answer.threadId) }, { $inc: { answersCount: -1 } })

    res.json({ message: 'Answer successfully deleted' })

    req.io.to('thread:' + answer.threadId).emit('answerDeleted', { id: answerId })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.editAnswer = async (req, res, next) => {
  try {
    upload(req, res, async (err) => {
      if (err) return next(createError.BadRequest(err.message))

      const { answerId, body } = JSON.parse(req.body.postData)

      if (!answerId) return next(createError.BadRequest('answerId must not be empty'))
      if (body.trim() === '') return next(createError.BadRequest('Answer body must not be empty'))

      const answer = await Answer.findById(answerId)

      if (req.payload.id !== answer.author.toString()) return next(createError.Unauthorized('Action not allowed'))

      if (req.files.length && answer.attach && answer.attach.length) {
        const files = answer.attach.reduce((array, item) => [
          ...array,
          path.join(__dirname, '..', '..', '..', 'public', 'forum', path.basename(item.file))
        ], [])

        deleteFiles(files, (err) => {
          if (err) console.error(err)
        })
      }

      let files = answer.attach
      if (req.files.length) {
        files = req.files.reduce((array, item) => [...array, {
          file: `/forum/${item.filename}`,
          type: item.mimetype,
          size: item.size
        }], [])
      }

      await Answer.updateOne({ _id: Mongoose.Types.ObjectId(answerId) }, {
        body: body.substring(0, 1000),
        edited: {
          createdAt: new Date().toISOString()
        },
        attach: files
      })

      const populate = [{
        path: 'author',
        select: '_id name displayName onlineAt picture role ban'
      }, {
        path: 'likes',
        select: '_id name displayName picture'
      }]
      const editedAnswer = await Answer.findById(answerId).populate(populate)

      res.json(editedAnswer)

      req.io.to('thread:' + answer.threadId).emit('answerEdited', editedAnswer)
    })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.likeAnswer = async (req, res, next) => {
  try {
    const { answerId } = req.body

    if (!answerId) return next(createError.BadRequest('answerId must not be empty'))

    const answer = await Answer.findById(answerId)

    if (answer.likes.find(like => like.toString() === req.payload.id)) {
      answer.likes = answer.likes.filter(like => like.toString() !== req.payload.id) // unlike
    } else {
      answer.likes.push(req.payload.id) // like
    }
    await answer.save()

    const populate = [{
      path: 'author',
      select: '_id name displayName onlineAt picture role ban'
    }, {
      path: 'likes',
      select: '_id name displayName picture'
    }]
    const likedAnswer = await Answer.findById(answerId).populate(populate)

    res.json(likedAnswer)

    req.io.to('thread:' + answer.threadId).emit('answerLiked', likedAnswer)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

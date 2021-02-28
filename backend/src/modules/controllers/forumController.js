const fs = require('fs');
const path = require('path');
const Mongoose = require('mongoose');
const createError = require('http-errors');
const multer = require('multer');

const Board = require('../models/Board');
const Thread = require('../models/Thread');
const Answer = require('../models/Answer');

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
  limits: { fileSize: 1048576 * 24 }, // 24Mb
}).array('attach')

module.exports.getBoards = async (req, res, next) => { 
  try {
    const { limit = 10, page = 1, sort } = req.query

    let boards
    if (sort === 'popular') {
      boards = await Board.paginate({}, { sort: { threadsCount: -1 }, page, limit })
    } else if (sort === 'answersCount') {
      boards = await Board.paginate({}, { sort: { answersCount: -1 }, page, limit })
    } else if (sort === 'newestThread') {
      boards = await Board.paginate({}, { sort: { newestThread: -1 }, page, limit })
    } else if (sort === 'newestAnswer') {
      boards = await Board.paginate({}, { sort: { newestAnswer: -1 }, page, limit })
    } else {
      boards = await Board.paginate({}, { sort: { position: 1 }, page, limit })
    }

    res.json(boards)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.createBoard = async (req, res, next) => { 
  try {
    const { title, body, position } = req.body
    const admin = req.payload.role === 'admin'

    if (!admin) return next(createError.Unauthorized('Action not allowed'))
    if (title.trim() === '') return next(createError.BadRequest('Board title must not be empty'))
    if (!position || !Number.isInteger(position) || position < 0) return next(createError.BadRequest('Position must be number'))

    const newBoard = new Board({
      title,
      body,
      position,
      createdAt: new Date().toISOString(),
      threadsCount: 0,
      answersCount: 0
    })

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
    const { boardId, title, body, position } = req.body
    const admin = req.payload.role === 'admin'

    if (!admin) return next(createError.Unauthorized('Action not allowed'))
    if (title.trim() === '') return next(createError.BadRequest('Board title must not be empty'))
    if (!position || !Number.isInteger(position) || position < 0) return next(createError.BadRequest('Position must be number'))

    await Board.updateOne({ _id: Mongoose.Types.ObjectId(boardId) }, { title, body, position })
    const board = await Board.findById(boardId)

    res.json(board)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getRecentlyThreads = async (req, res, next) => { 
  try {
    const { limit = 10, page = 1 } = req.query

    const threads = await Thread.paginate({}, { sort: { pined: -1, createdAt: -1 }, page, limit })

    res.json(threads)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getThreads = async (req, res, next) => { 
  try {
    const { boardId, limit = 10, page = 1, sort } = req.query

    if (!boardId) return next(createError.BadRequest('boardId must not be empty'))

    let threads
    if (sort === 'answersCount') {
      threads = await Thread.paginate({ boardId }, { sort: { pined: -1, answersCount: -1 }, page, limit })
    } else if (sort === 'newestThread') {
      threads = await Thread.paginate({ boardId }, { sort: { pined: -1, createdAt: -1 }, page, limit })
    } else if (sort === 'newestAnswer') {
      threads = await Thread.paginate({ boardId }, { sort: { pined: -1, newestAnswer: -1 }, page, limit })
    } else {
      threads = await Thread.paginate({ boardId }, { sort: { pined: -1, createdAt: -1 }, page, limit })
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

    const thread = await Thread.findById(threadId)

    res.json(thread)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getAnswers = async (req, res, next) => { 
  try {
    const { threadId, limit = 10, page = 1 } = req.query

    if (!threadId) return next(createError.BadRequest('threadId must not be empty'))

    const answers = await Answer.paginate({ threadId }, { page, limit })

    res.json(answers)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

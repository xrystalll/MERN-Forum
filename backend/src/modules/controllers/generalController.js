const Mongoose = require('mongoose');
const createError = require('http-errors');

const User = require('../models/User');
const Board = require('../models/Board');
const Thread = require('../models/Thread');
const Answer = require('../models/Answer');
const Ban = require('../models/Ban');

const getStats = async (req, res, next) => {
  try {
    res.json([{
      _id: 1,
      title: 'Users',
      count: await User.countDocuments()
    }, {
      _id: 2,
      title: 'Boards',
      count: await Board.countDocuments()
    }, {
      _id: 3,
      title: 'Threads',
      count: await Thread.countDocuments()
    }, {
      _id: 4,
      title: 'Answers',
      count: await Answer.countDocuments()
    }, {
      _id: 5,
      title: 'Bans',
      count: await Ban.countDocuments()
    }])
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

const getUsers = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, sort } = req.query

    let users
    const select = '_id name displayName createdAt onlineAt picture role'
    if (sort === 'online') {
      const date = new Date()
      date.setMinutes(date.getMinutes() - 5)
      users = await User.paginate({ onlineAt: { $gte: date.toISOString() } }, { sort: { onlineAt: -1 }, page, limit, select })
    } else if (sort === 'admin') {
      users = await User.paginate({ role: 'admin' }, { sort: { onlineAt: -1 }, page, limit, select })
    } else if (sort === 'old') {
      users = await User.paginate({}, { sort: { createdAt: 1 }, page, limit, select })
    } else {
      users = await User.paginate({}, { sort: { createdAt: -1 }, page, limit, select })
    }

    res.json(users)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

const getUser = async (req, res, next) => {
  try {
    const { userName } = req.query

    const select = '_id name displayName createdAt onlineAt picture role ban'
    const populate = {
      path: 'ban',
      select: '_id admin reason body createdAt expiresAt',
      populate: {
        path: 'admin',
        select: '_id name displayName onlineAt picture role'
      }
    }
    const user = await User.findOne({ name: userName }, select).populate(populate)

    if (user.ban) {
      if (user.ban.expiresAt < new Date().toISOString()) {
        await User.updateOne({ _id: Mongoose.Types.ObjectId(user._id) }, { ban: null })
      }
    }

    res.json(user)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

const getBans = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query

    const select = '_id name displayName createdAt onlineAt picture role ban'
    const populate = {
      path: 'ban',
      select: '_id admin reason body createdAt expiresAt',
      populate: {
        path: 'admin',
        select: '_id name displayName onlineAt picture role'
      }
    }
    const bans = await User.paginate({ ban: { $ne: null } }, { page, limit, select, populate })

    res.json(bans)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

const getBan = async (req, res, next) => {
  try {
    const { userId } = req.query

    const select = '_id name displayName createdAt onlineAt picture role ban'
    const populate = {
      path: 'ban',
      select: '_id admin reason body createdAt expiresAt',
      populate: {
        path: 'admin',
        select: '_id name displayName onlineAt picture role'
      }
    }
    const user = await User.findOne({ _id: Mongoose.Types.ObjectId(userId) }, select).populate(populate)

    res.json(user)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

const createBan = async (req, res, next) => {
  try {
    const { userId, reason, body = '', expiresAt } = req.body
    const admin = req.payload.role === 'admin'

    if (!admin) return next(createError.Unauthorized('Action not allowed'))
    if (!userId) return next(createError.BadRequest('userId must not be empty'))
    if (reason.trim() === '') return next(createError.BadRequest('Reason must not be empty'))
    if (!expiresAt) return next(createError.BadRequest('expiresAt must not be empty'))

    const newBan = new Ban({
      user: userId,
      admin: req.payload.id,
      reason,
      body: body.substring(0, 100),
      createdAt: new Date().toISOString(),
      expiresAt
    })

    const ban = await newBan.save()

    await User.updateOne({ _id: Mongoose.Types.ObjectId(userId) }, { ban: ban._id })

    res.json(ban)

    req.io.to('notification:' + userId).emit('ban', ban)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

const unBan = async (req, res, next) => {
  try {
    const { userId } = req.body
    const admin = req.payload.role === 'admin'

    if (!admin) return next(createError.Unauthorized('Action not allowed'))
    if (!userId) return next(createError.BadRequest('userId must not be empty'))

    await User.updateOne({ _id: Mongoose.Types.ObjectId(userId) }, { ban: null })

    res.json('User unbanned')

    req.io.to('banned:' + userId).emit('unban', { message: 'Unbanned' })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports = { getStats, getUsers, getUser, getBans, getBan, createBan, unBan }

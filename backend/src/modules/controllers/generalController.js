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

    const select = '_id name displayName createdAt onlineAt picture role'
    const user = await User.findOne({ name: userName }, select)

    res.json(user)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports = { getStats, getUsers, getUser }

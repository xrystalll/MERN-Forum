const Mongoose = require('mongoose');
const createError = require('http-errors');

const User = require('../models/User');

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
    const { userId } = req.query

    const select = '_id name displayName createdAt onlineAt picture role'
    const user = await User.findOne({ _id: Mongoose.Types.ObjectId(userId) }, select)

    res.json(user)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports = { getUsers, getUser }

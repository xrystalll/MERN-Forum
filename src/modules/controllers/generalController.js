const path = require('path');
const { Types } = require('mongoose');
const createError = require('http-errors');

const User = require('../models/User');
const Board = require('../models/Board');
const Thread = require('../models/Thread');
const Answer = require('../models/Answer');
const Ban = require('../models/Ban');
const Report = require('../models/Report');
const File = require('../models/File');
const Comment = require('../models/Comment');
const Dialogue = require('../models/Dialogue');
const Message = require('../models/Message');
const AuthHistory = require('../models/AuthHistory');

const deleteFiles = require('../utils/deleteFiles');

module.exports.getStats = async (req, res, next) => {
  try {
    const bans = await User.find({ ban: { $ne: null } })

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
      count: bans.length
    }, {
      _id: 6,
      title: 'Files',
      count: await File.countDocuments()
    }])
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getUsers = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, sort } = req.query

    let users
    const select = '_id name displayName createdAt onlineAt picture karma role ban'
    if (sort === 'online') {
      const date = new Date()
      date.setMinutes(date.getMinutes() - 5)
      users = await User.paginate({ onlineAt: { $gte: date.toISOString() } }, { sort: { onlineAt: -1 }, page, limit, select })
    } else if (sort === 'admin') {
      users = await User.paginate({ role: { $gte: 2 } }, { sort: { onlineAt: -1 }, page, limit, select })
    } else if (sort === 'old') {
      users = await User.paginate({}, { sort: { createdAt: 1 }, page, limit, select })
    } else if (sort === 'karma') {
      users = await User.paginate({}, { sort: { karma: -1, onlineAt: -1 }, page, limit, select })
    } else {
      users = await User.paginate({}, { sort: { createdAt: -1 }, page, limit, select })
    }

    res.json(users)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getAdmins = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query

    const select = '_id name displayName createdAt onlineAt picture role ban'
    const admins = await User.paginate({ role: { $gte: 2 } }, { sort: { createdAt: -1 }, page, limit, select })

    res.json(admins)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getUser = async (req, res, next) => {
  try {
    const { userName } = req.query

    if (!userName) return next(createError.BadRequest('userName must not be empty'))

    const select = '_id name displayName createdAt onlineAt picture karma role ban'
    const populate = {
      path: 'ban',
      select: '_id admin reason body createdAt expiresAt',
      populate: {
        path: 'admin',
        select: '_id name displayName onlineAt picture role'
      }
    }
    const user = await User.findOne({ name: userName }, select).populate(populate)

    if (!user) return next(createError.BadRequest('User not found'))

    if (user.ban) {
      if (user.ban.expiresAt < new Date().toISOString()) {
        await User.updateOne({ _id: Types.ObjectId(user._id) }, { ban: null })
        user.ban = null
      }
    }

    res.json(user)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getBans = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, sort } = req.query

    let bans
    if (sort === 'all') {
      const populate = [{
        path: 'user',
        select: '_id name displayName onlineAt picture role ban'
      }, {
        path: 'admin',
        select: '_id name displayName onlineAt picture role'
      }]
      bans = await Ban.paginate({}, { sort: { createdAt: -1 }, page, limit, populate })
    } else {
      const select = '_id name displayName createdAt onlineAt picture role ban'
      const populate = {
        path: 'ban',
        select: '_id admin reason body createdAt expiresAt',
        populate: {
          path: 'admin',
          select: '_id name displayName onlineAt picture role'
        }
      }
      bans = await User.paginate({ ban: { $ne: null } }, { page, limit, select, populate })
    }

    res.json(bans)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getUserBans = async (req, res, next) => {
  try {
    const { userId, limit = 10, page = 1 } = req.query

    if (!userId) return next(createError.BadRequest('userId must not be empty'))

    const populate = [{
      path: 'user',
      select: '_id name displayName onlineAt picture role ban'
    }, {
      path: 'admin',
      select: '_id name displayName onlineAt picture role'
    }]
    const bans = await Ban.paginate({ user: userId }, { sort: { createdAt: -1 }, page, limit, populate })

    res.json(bans)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getBan = async (req, res, next) => {
  try {
    const { userId } = req.query

    if (!userId) return next(createError.BadRequest('userId must not be empty'))

    const select = '_id name displayName createdAt onlineAt picture role ban'
    const populate = {
      path: 'ban',
      select: '_id admin reason body createdAt expiresAt',
      populate: {
        path: 'admin',
        select: '_id name displayName onlineAt picture role'
      }
    }
    const user = await User.findOne({ _id: Types.ObjectId(userId) }, select).populate(populate)

    res.json(user)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.createBan = async (req, res, next) => {
  try {
    const { userId, reason, body = '', expiresAt } = req.body
    const moder = req.payload.role >= 2

    if (!moder) return next(createError.Unauthorized('Action not allowed'))
    if (!userId) return next(createError.BadRequest('userId must not be empty'))
    if (reason.trim() === '') return next(createError.BadRequest('Reason must not be empty'))
    if (!expiresAt) return next(createError.BadRequest('expiresAt must not be empty'))

    const user = await User.findById(userId).select('role')

    if (!user) return next(createError.BadRequest('User not found'))
    if (req.payload.role < user.role) return next(createError.Unauthorized('Action not allowed'))

    const now = new Date().toISOString()

    const newBan = new Ban({
      user: userId,
      admin: req.payload.id,
      reason,
      body: body.substring(0, 100),
      createdAt: now,
      expiresAt
    })

    const ban = await newBan.save()

    const diff = new Date(expiresAt) - new Date(now)
    const minutes = diff / 60000
    await User.updateOne({ _id: Types.ObjectId(userId) }, { $inc: { karma: minutes > 43799 ? -50 : -20 }, ban: ban._id })

    res.json(ban)

    req.io.to('notification:' + userId).emit('ban', ban)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.unBan = async (req, res, next) => {
  try {
    const { userId } = req.body
    const moder = req.payload.role >= 2

    if (!moder) return next(createError.Unauthorized('Action not allowed'))
    if (!userId) return next(createError.BadRequest('userId must not be empty'))

    await User.updateOne({ _id: Types.ObjectId(userId) }, { $inc: { karma: 10 }, ban: null })

    res.json('User unbanned')

    req.io.to('banned:' + userId).emit('unban', { message: 'Unbanned' })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.deleteBan = async (req, res, next) => {
  try {
    const { banId } = req.body
    const moder = req.payload.role >= 2

    if (!moder) return next(createError.Unauthorized('Action not allowed'))
    if (!banId) return next(createError.BadRequest('banId must not be empty'))

    const ban = await Ban.findById(banId)
    await ban.delete()

    res.json('Ban successfully deleted')
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getUserStats = async (req, res, next) => {
  try {
    const { userId } = req.query

    if (!userId) return next(createError.BadRequest('userId must not be empty'))

    const user = await User.findById(userId)

    if (!user) return next(createError.BadRequest('User not found'))

    const threads = await Thread.find({ author: Types.ObjectId(userId) })
    const answers = await Answer.find({ author: Types.ObjectId(userId) })
    const bans = await Ban.find({ user: Types.ObjectId(userId) })
    const files = await File.find({ author: Types.ObjectId(userId) })
    const comments = await Comment.find({ author: Types.ObjectId(userId) })

    res.json({
      threadsCount: threads.length,
      answersCount: answers.length,
      bansCount: bans.length,
      filesCount: files.length,
      fileCommentsCount: comments.length,
      karma: user.karma
    })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getUserThreads = async (req, res, next) => {
  try {
    const { userId, limit = 10, page = 1 } = req.query

    if (!userId) return next(createError.BadRequest('userId must not be empty'))

    const populate = [{
      path: 'author',
      select: '_id name displayName onlineAt picture role ban'
    }, {
      path: 'likes',
      select: '_id name displayName picture'
    }]
    const threads = await Thread.paginate({ author: userId }, { sort: { createdAt: -1 }, page, limit, populate })

    res.json(threads)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getUserAnswers = async (req, res, next) => {
  try {
    const { userId, limit = 10, page = 1 } = req.query

    if (!userId) return next(createError.BadRequest('userId must not be empty'))

    const populate = [{
      path: 'author',
      select: '_id name displayName onlineAt picture role ban'
    }, {
      path: 'likes',
      select: '_id name displayName picture'
    }]
    const answers = await Answer.paginate({ author: userId }, { sort: { createdAt: -1 }, page, limit, populate })

    res.json(answers)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getAuthHistory = async (req, res, next) => {
  try {
    const { userId, limit = 10, page = 1 } = req.query
    const moder = req.payload.role >= 2

    if (!userId) return next(createError.BadRequest('userId must not be empty'))
    if (req.payload.id !== userId ) {
      if (!moder) {
        return next(createError.Unauthorized('Action not allowed'))
      }
    }

    const populate = {
      path: 'user',
      select: '_id name displayName onlineAt picture role ban'
    }
    const authHistory = await AuthHistory.paginate({ user: userId }, { sort: { loginAt: -1 }, page, limit, populate })

    res.json(authHistory)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.searchAuthHistory = async (req, res, next) => {
  try {
    const { ip, limit = 10, page = 1 } = req.query
    const moder = req.payload.role >= 2

    if (!moder) return next(createError.Unauthorized('Action not allowed'))
    if (!ip) return next(createError.BadRequest('ip must not be empty'))

    const populate = {
      path: 'user',
      select: '_id name displayName onlineAt picture role ban'
    }
    const authHistory = await AuthHistory.paginate(
      { $text: { $search: ip } },
      { sort: { ip: -1, ua: -1, loginAt: -1 }, page, limit, populate }
    )

    res.json(authHistory)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.getReports = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, sort } = req.query
    const moder = req.payload.role >= 2

    if (!moder) return next(createError.Unauthorized('Action not allowed'))

    const populate = {
      path: 'from',
      select: '_id name displayName onlineAt picture role ban'
    }
    const read = sort === 'read' ? { read: true } : { read: false }
    const reports = await Report.paginate(read, { sort: { createdAt: -1 }, page, limit, populate })

    if (reports.totalDocs) {
      await Report.updateMany({ read: false }, { read: true })
    }

    res.json(reports)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.createReport = async (req, res, next) => {
  try {
    const { threadId, postId, body } = req.body

    if (!threadId) return next(createError.BadRequest('threadId must not be empty'))
    if (!postId) return next(createError.BadRequest('postId must not be empty'))
    if (body.trim() === '') return next(createError.BadRequest('Report body must not be empty'))

    const reportExist = await Report.find({ postId: Types.ObjectId(postId) })
    if (reportExist.length) return next(createError.BadRequest('Report to the post already has'))

    const thread = await Thread.findById(threadId)

    const newReport = new Report({
      from: req.payload.id,
      threadId,
      postId,
      title: thread.title,
      body: body.substring(0, 1000),
      createdAt: new Date().toISOString(),
      read: false
    })
    const report = await newReport.save()

    const populate = {
      path: 'from',
      select: '_id name displayName onlineAt picture role ban'
    }
    const populatedReport = await Report.findById(report._id).populate(populate)

    res.json(populatedReport)

    req.io.to('adminNotification').emit('newAdminNotification', { type: 'report' })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.deleteReports = async (req, res, next) => {
  try {
    const moder = req.payload.role >= 2

    if (!moder) return next(createError.Unauthorized('Action not allowed'))

    await Report.deleteMany({ read: true })

    res.json({ message: 'Reports successfully deleted' })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.search = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, query, type } = req.query

    if (!query) return next(createError.BadRequest('query must not be empty'))

    const populate = [{
      path: 'author',
      select: '_id name displayName onlineAt picture role ban'
    }, {
      path: 'likes',
      select: '_id name displayName picture'
    }]
    let results
    if (type === 'answers') {
      results = await Answer.paginate({ $text: { $search: query } }, { sort: { createdAt: -1 }, page, limit, populate })
    } else if (type === 'users') {
      const select = '_id name displayName createdAt onlineAt picture role ban'
      results = await User.paginate({ $text: { $search: query } }, { sort: { onlineAt: -1 }, page, limit, select })
    } else if (type === 'boards') {
      results = await Board.paginate({ $text: { $search: query } }, { sort: { newestAnswer: -1 }, page, limit })
    } else {
      results = await Thread.paginate({ $text: { $search: query } }, { sort: { createdAt: -1 }, page, limit, populate })
    }

    res.json(results)
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.editRole = async (req, res, next) => {
  try {
    const { userId, role = 1 } = req.body
    const admin = req.payload.role === 3

    if (!admin) return next(createError.Unauthorized('Action not allowed'))
    if (!role || !Number.isInteger(role) || role < 1) return next(createError.BadRequest('Role must be number'))
    if (!role > 2) return next(createError.BadRequest('Max role number: 2'))
    if (!userId) return next(createError.BadRequest('userId must not be empty'))

    await User.updateOne({ _id: Types.ObjectId(userId) }, { role })

    res.json({ message: 'User role updated' })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

module.exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.body
    const admin = req.payload.role === 3

    if (!admin) return next(createError.Unauthorized('Action not allowed'))
    if (!userId) return next(createError.BadRequest('userId must not be empty'))

    const user = await User.findById(userId)

    await Ban.deleteMany({ user: userId })

    const dialogues = await Dialogue.find({
      $or: [{
        to: Types.ObjectId(userId)
      }, {
        from: Types.ObjectId(userId)
      }]
    })
    await Promise.all(dialogues.map(async (item) => {
      const dialogue = await Dialogue.findById(item._id)
      await dialogue.delete()
    }))

    const messages = await Message.find({
      $or: [{
        to: Types.ObjectId(userId)
      }, {
        from: Types.ObjectId(userId)
      }]
    })
    await Promise.all(messages.map(async (item) => {
      const message = await Message.findById(item._id)

      if (message.file && message.file.length) {
        const files = message.file.reduce((array, item) => {
            if (item.thumb) {
              return [
                ...array,
                path.join(__dirname, '..', '..', '..', 'public', 'message', path.basename(item.file)),
                path.join(__dirname, '..', '..', '..', 'public', 'message', 'thumbnails', path.basename(item.thumb))
              ]
            }

            return [
              ...array,
              path.join(__dirname, '..', '..', '..', 'public', 'message', path.basename(item.file))
            ]
          }, [])

        deleteFiles(files, (err) => {
          if (err) console.error(err)
        })
      }

      await messages.delete()
    }))

    await user.delete()

    res.json({ message: 'User successfully deleted' })
  } catch(err) {
    next(createError.InternalServerError(err))
  }
}

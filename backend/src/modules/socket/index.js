const sockeIO = require('socket.io');
const { Types } = require('mongoose');

const Notification = require('../models/Notification');
const Report = require('../models/Report');
const File = require('../models/File');
const Message = require('../models/Message');

const { verifyAccessTokenIO } = require('../utils/jwt');

module.exports = (server) => {
  const io = sockeIO(server, {
    cors: {
      origin: process.env.CLIENT,
    }
  })

  io.on('connection', (socket) => {
    socket.on('join', async (data) => {
      let jwtData = null
      if (data.payload && data.payload.token) {
        jwtData = verifyAccessTokenIO(data.payload.token)
      }

      socket.join(data.room)

      if (/notification:/.test(data.room)) {
        if (!jwtData || jwtData.id !== data.room.replace('notification:', '')) {
          io.to(data.room).emit('error', createError.Unauthorized())
          socket.leave(data.room)
          return
        }

        const notifications = await Notification.find({ to: Types.ObjectId(jwtData.id), read: false })
        io.to(data.room).emit('notificationsCount', { count: notifications.length })
      }

      if (data.room === 'adminNotification') {
        if (!jwtData || jwtData.role < 2) {
          io.to(data.room).emit('error', createError.Unauthorized())
          socket.leave(data.room)
          return
        }

        const reports = await Report.find({ read: false })
        if (reports.length) {
          io.to(data.room).emit('newAdminNotification', { type: 'report' })
        }
        const files = await File.find({ moderated: false })
        if (files.length) {
          io.to(data.room).emit('newAdminNotification', { type: 'file' })
        }
      }

      if (/pmCount:/.test(data.room)) {
        if (!jwtData || jwtData.id !== data.room.replace('pmCount:', '')) {
          io.to(data.room).emit('error', createError.Unauthorized())
          socket.leave(data.room)
          return
        }

        const messages = await Message.find({ to: Types.ObjectId(jwtData.id), read: false })
        io.to(data.room).emit('messagesCount', { count: messages.length })
      }

      if (/pm:/.test(data.room)) {
        if (!jwtData || jwtData.id !== data.room.replace('pm:', '')) {
          io.to(data.room).emit('error', createError.Unauthorized())
          socket.leave(data.room)
          return
        }

        const { page, limit } = data.payload
        const from = data.room.split(':')[1]
        const to = data.room.split(':')[2]
        const populate = [{
          path: 'from',
          select: '_id name displayName onlineAt picture role'
        }, {
          path: 'to',
          select: '_id name displayName onlineAt picture role'
        }]
        const messages = await Message.paginate({ from: Types.ObjectId(from), to: Types.ObjectId(to) }, {
          sort: { createdAt: -1 },
          page,
          limit,
          populate
        })
        io.to(data.room).emit('messages', messages)
      }
    })

    socket.on('leave', (data) => {
      socket.leave(data.room)
    })
  })

  return io
}

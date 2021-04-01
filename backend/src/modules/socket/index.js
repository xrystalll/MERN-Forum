const socketIO = require('socket.io');
const { Types } = require('mongoose');
const createError = require('http-errors');

const Notification = require('../models/Notification');
const Report = require('../models/Report');
const File = require('../models/File');
const Message = require('../models/Message');
const Dialogue = require('../models/Dialogue');

const { verifyAccessTokenIO } = require('../utils/jwt');

module.exports = (server) => {
  const io = socketIO(server, {
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
        if (!jwtData || jwtData.id !== data.payload.userId) {
          io.to(data.room).emit('error', createError.Unauthorized())
          socket.leave(data.room)
          return
        }

        io.to(data.room).emit('joinedToPM')
      }
    })

    socket.on('leave', (data) => {
      socket.leave(data.room)
    })

    socket.on('createMessage', async (data) => {
      const { token, dialogueId, body, to } = data

      let jwtData = null
      if (token) {
        jwtData = verifyAccessTokenIO(token)
      }
      if (!jwtData) {
        io.to('pm:' + dialogueId).emit('error', createError.Unauthorized())
        socket.leave('pm:' + dialogueId)
        return
      }

      try {
        const newMessage = new Message({
          dialogueId,
          body,
          createdAt: new Date().toISOString(),
          from: jwtData.id,
          to,
          read: false
        })

        const message = await newMessage.save()
        await Dialogue.updateOne({ _id: Types.ObjectId(dialogueId) }, { lastMessage: message._id })

        const populate = [{
          path: 'from',
          select: '_id name displayName onlineAt picture role'
        }, {
          path: 'to',
          select: '_id name displayName onlineAt picture role'
        }]
        const populatedMessage = await Message.findById(message._id).populate(populate)
        io.to('pm:' + dialogueId).emit('newMessage', populatedMessage)
      } catch(err) {
        io.to('pm:' + dialogueId).emit('error', err)
      }
    })
  })

  return io
}

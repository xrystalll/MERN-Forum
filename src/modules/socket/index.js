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

  const joinedList = []

  io.on('connection', (socket) => {
    socket.on('join', async (data) => {
      let jwtData = null
      if (data.payload && data.payload.token) {
        jwtData = verifyAccessTokenIO(data.payload.token)
      }

      socket.join(data.room)

      if (/thread:/.test(data.room)) {
        if (!jwtData) return

        const threadId = data.room.replace('thread:', '')
        const { id, name, displayName, picture, role } = jwtData
        const joinedObj = {
          threadId,
          socket: socket.id,
          user: {
            _id: id,
            name,
            displayName,
            picture,
            role
          }
        }
        if (joinedList.findIndex(item => item.user._id === id) === -1) {
          joinedList.push(joinedObj)
        }

        const listByThreadId = joinedList.filter(item => item.threadId === threadId)

        io.to(data.room).emit('joinedList', listByThreadId)
      }

      if (/notification:/.test(data.room)) {
        if (!jwtData || jwtData.id !== data.room.replace('notification:', '')) {
          socket.emit('error', createError.Unauthorized())
          socket.leave(data.room)
          return
        }

        const notifications = await Notification.find({ to: Types.ObjectId(jwtData.id), read: false })

        io.to(data.room).emit('notificationsCount', { count: notifications.length })
      }

      if (data.room === 'adminNotification') {
        if (!jwtData || jwtData.role < 2) {
          socket.emit('error', createError.Unauthorized())
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
          socket.emit('error', createError.Unauthorized())
          socket.leave(data.room)
          return
        }

        const dialogues = await Dialogue.find({
          $or: [{
            to: Types.ObjectId(jwtData.id)
          }, {
            from: Types.ObjectId(jwtData.id)
          }]
        }).populate({ path: 'lastMessage' })

        const noRead = dialogues.filter(item => item.lastMessage && !item.lastMessage.read && item.lastMessage.to.toString() === jwtData.id)

        io.to(data.room).emit('messagesCount', { count: noRead.length })
      }

      if (/dialogues:/.test(data.room)) {
        if (!jwtData || jwtData.id !== data.room.replace('dialogues:', '')) {
          socket.emit('error', createError.Unauthorized())
          socket.leave(data.room)
          return
        }
      }

      if (/pm:/.test(data.room)) {
        if (!jwtData || jwtData.id !== data.payload.userId) {
          socket.emit('error', createError.Unauthorized())
          socket.leave(data.room)
          return
        }
      }
    })

    socket.on('leave', (data) => {
      socket.leave(data.room)

      if (/thread:/.test(data.room)) {
        const threadId = data.room.replace('thread:', '')

        const removeIndex = joinedList.findIndex(item => item.socket === socket.id)
        if (removeIndex !== -1) {
          joinedList.splice(removeIndex, 1)
        }

        const listByThreadId = joinedList.filter(item => item.threadId === threadId)

        io.to(data.room).emit('joinedList', listByThreadId)
      }
    })

    socket.on('disconnect', (reason) => {
      const removeIndex = joinedList.findIndex(item => item.socket === socket.id)
      if (removeIndex !== -1) {
        joinedList.splice(removeIndex, 1)
      }
    })

    socket.on('createMessage', async (data) => {
      const { token, dialogueId, body, to } = data

      let jwtData = null
      if (token) {
        jwtData = verifyAccessTokenIO(token)
      }
      if (!jwtData) {
        socket.emit('error', createError.Unauthorized())
        socket.leave('pm:' + dialogueId)
        return
      }

      try {
        let isNewDialogue = false
        let dId
        const dialogueExist = await Dialogue.findOne({ _id: Types.ObjectId(dialogueId) })

        if (!dialogueExist) {
          isNewDialogue = true

          const newDialogue = new Dialogue({
            from: jwtData.id,
            to
          })

          const dialogue = await newDialogue.save()
          dId = dialogue._id

          socket.emit('joinToDialogue', dialogue)
        } else {
          dId = dialogueExist._id
        }

        const now = new Date().toISOString()

        const newMessage = new Message({
          dialogueId: dId,
          body: body.substring(0, 1000),
          createdAt: now,
          from: jwtData.id,
          to,
          read: false
        })

        const message = await newMessage.save()
        await Dialogue.updateOne({ _id: Types.ObjectId(dId) }, { lastMessage: message._id, updatedAt: now })

        const populate = [{
          path: 'from',
          select: '_id name displayName onlineAt picture role ban'
        }, {
          path: 'to',
          select: '_id name displayName onlineAt picture role ban'
        }]
        const populatedMessage = await Message.findById(message._id).populate(populate)

        io.to('pm:' + dId).emit('newMessage', populatedMessage)

        const populatedDialogue = [{
          path: 'from',
          select: '_id name displayName onlineAt picture role ban'
        }, {
          path: 'to',
          select: '_id name displayName onlineAt picture role ban'
        }, {
          path: 'lastMessage'
        }]
        const newOrUpdatedDialogue = await Dialogue.findById(dId).populate(populatedDialogue)

        if (isNewDialogue) {
          io.to('dialogues:' + to).emit('newDialogue', newOrUpdatedDialogue)
        } else {
          io.to('dialogues:' + to).emit('updateDialogue', newOrUpdatedDialogue)
        }

        const dialogues = await Dialogue.find({
          $or: [{
            to: Types.ObjectId(jwtData.id)
          }, {
            from: Types.ObjectId(jwtData.id)
          }]
        }).populate({ path: 'lastMessage' })

        const noRead = dialogues.filter(item => item.lastMessage && !item.lastMessage.read && item.lastMessage.to.toString() === to)

        socket.to('pmCount:' + to).emit('messagesCount', { count: noRead.length })
      } catch(err) {
        socket.emit('error', err)
      }
    })

    socket.on('readMessages', async (data) => {
      const { token, dialogueId, from } = data

      let jwtData = null
      if (token) {
        jwtData = verifyAccessTokenIO(token)
      }
      if (!jwtData) {
        socket.emit('error', createError.Unauthorized())
        socket.leave('pm:' + dialogueId)
        return
      }

      try {
        await Message.updateMany({ dialogueId: Types.ObjectId(dialogueId), from }, { read: true })

        socket.to('pm:' + dialogueId).emit('messagesRead')

        const dialogues = await Dialogue.find({
          $or: [{
            to: Types.ObjectId(jwtData.id)
          }, {
            from: Types.ObjectId(jwtData.id)
          }]
        }).populate({ path: 'lastMessage' })

        const noRead = dialogues.filter(item => item.lastMessage && !item.lastMessage.read && item.lastMessage.to.toString() === jwtData.id)

        io.to('pmCount:' + jwtData.id).emit('messagesCount', { count: noRead.length })
      } catch(err) {
        io.to('pm:' + dialogueId).emit('error', err)
      }
    })

    socket.on('startType', (data) => {
      const { token, dialogueId } = data

      let jwtData = null
      if (token) {
        jwtData = verifyAccessTokenIO(token)
      }
      if (!jwtData) {
        socket.emit('error', createError.Unauthorized())
        socket.leave('pm:' + dialogueId)
        return
      }

      socket.to('pm:' + dialogueId).emit('startTyping', { userName: jwtData.displayName })
    })

    socket.on('stopType', (data) => {
      const { token, dialogueId } = data

      let jwtData = null
      if (token) {
        jwtData = verifyAccessTokenIO(token)
      }
      if (!jwtData) {
        socket.emit('error', createError.Unauthorized())
        socket.leave('pm:' + dialogueId)
        return
      }

      socket.to('pm:' + dialogueId).emit('stopTyping', { userName: jwtData.displayName })
    })
  })

  return io
}

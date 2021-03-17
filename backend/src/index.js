require('dotenv').config();

const path = require('path');

const http = require('http');
const express = require('express');
const cors = require('cors');
const RateLimit = require('express-rate-limit');
const createError = require('http-errors');

const Mongoose = require('mongoose');
const DB = require('./modules/DB');
const Notification = require('./modules/models/Notification');
const Report = require('./modules/models/Report');
const File = require('./modules/models/File');

const app = express()

const httpServer = http.createServer(app)
const io = require('socket.io')(httpServer, {
  cors: {
    origin: process.env.CLIENT,
  }
})

app.use(express.static(path.join(__dirname, '..', '/public')))
app.use(cors({
  origin: process.env.CLIENT
}))
app.use(express.json())

const limiter = new RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 50,
  message: {
    error: {
      status: 429,
      message: 'Too many requests per minute'
    }
  }
})
app.use('/auth', limiter)
app.use('/api', limiter) 

app.use('/', require('./routes'))
app.use('/auth', require('./routes/auth'))

io.on('connection', (socket) => {
  socket.on('join', async (data) => {
    socket.join(data.room)

    if (/notification:/.test(data.room)) {
      const userId = data.room.replace('notification:', '')
      const notifications = await Notification.find({ to: Mongoose.Types.ObjectId(userId), read: false })
      io.to(data.room).emit('notificationsCount', { count: notifications.length })
    }

    if (data.room === 'adminNotification') {
      const reports = await Report.find({ read: false })
      if (reports.length) {
        io.to(data.room).emit('newAdminNotification', { type: 'report' })
      }
      const files = await File.find({ moderated: false })
      if (files.length) {
        io.to(data.room).emit('newAdminNotification', { type: 'file' })
      }
    }
  })

  socket.on('leave', (data) => {
    socket.leave(data.room)
  })
})

app.use((req, res, next) => {
  req.io = io
  next()
})

app.use('/api', require('./routes/api'))

app.use((req, res, next) => {
  next(createError.NotFound())
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.json({
    error: {
      status: err.status || 500,
      message: err.message
    }
  })
})

const port = process.env.PORT || 8000

DB().then(() => {
  httpServer.listen({ port }, () => {
    console.log(`Server run on ${process.env.BACKEND}`)
  })
}).catch(console.error)

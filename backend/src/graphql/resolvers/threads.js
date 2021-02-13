const { AuthenticationError, UserInputError } = require('apollo-server-express');
const Mongoose = require('mongoose');

const Thread = require('../../models/Thread');
const Answer = require('../../models/Answer');
const checkAuth = require('../../util/checkAuth');

module.exports = {
  Query: {
    async getThreads(_, { boardId, limit = 10, offset = 0 }) {
      try {
        const threads = await Thread.paginate({ boardId }, { sort: { pined: -1, createdAt: -1 }, offset, limit })
        return threads.docs
      } catch (err) {
        throw new Error(err)
      }
    },
    async getThread(_, { id }) {
      try {
        const thread = await Thread.findById(id)
        return thread
      } catch (err) {
        throw new Error(err)
      }
    },
    async getRecentlyThreads(_, { limit = 10, offset = 0 }) {
      try {
        const recentlyThreads = await Thread.paginate({}, { sort: { pined: -1, newestAnswer: -1 }, offset, limit })
        return recentlyThreads.docs
      } catch (err) {
        throw new Error(err)
      }
    }
  },

  Mutation: {
    async createThread(_, { boardId, title, body }, context) {
      const user = checkAuth(context)

      if (title.trim() === '') {
        throw new Error('Thread title must not be empty')
      }

      if (body.trim() === '') {
        throw new Error('Thread body must not be empty')
      }

      const newThread = new Thread({
        boardId,
        pined: false,
        closed: false,
        title,
        body,
        author: {
          id: user.id,
          username: user.username,
          role: user.role
        },
        createdAt: new Date().toISOString(),
        newestAnswer: new Date().toISOString()
      })

      const thread = await newThread.save()
      return thread
    },

    async deleteThread(_, { id }, context) {
      const { role } = checkAuth(context)

      try {
        if (role === 'admin') {
          const thread = await Thread.findById(id)
          await Answer.deleteMany({ threadId: id })
          await thread.delete()
          return 'Thread deleted successfully'
        }

        throw new AuthenticationError('Action not allowed')
      } catch (err) {
        throw new Error(err)
      }
    },

    async editThread(_, { id, title, body }, context) {
      const { username } = checkAuth(context)

      if (title.trim() === '') {
        throw new Error('Thread title must not be empty')
      }

      if (body.trim() === '') {
        throw new Error('Thread body must not be empty')
      }

      const thread = await Thread.findById(id)

      try {
        if (username === thread.author.username) {
          await Thread.updateOne({ _id: Mongoose.Types.ObjectId(id) }, {
            title,
            body,
            edited: {
              createdAt: new Date().toISOString()
            }
          })
          const editedThread = await Thread.findById(id)
          return editedThread
        }

        throw new AuthenticationError('Action not allowed')
      } catch (err) {
        throw new Error(err)
      }
    },

    async adminEditThread(_, { id, title, body, pined = false, closed = false }, context) {
      const { role } = checkAuth(context)

      if (title.trim() === '') {
        throw new Error('Thread title must not be empty')
      }

      if (body.trim() === '') {
        throw new Error('Thread body must not be empty')
      }

      try {
        if (role === 'admin') {
          await Thread.updateOne({ _id: Mongoose.Types.ObjectId(id) }, {
            title,
            body,
            pined,
            closed,
            edited: {
              createdAt: new Date().toISOString()
            }
          })
          const editedThread = await Thread.findById(id)
          return editedThread
        }

        throw new AuthenticationError('Action not allowed')
      } catch (err) {
        throw new Error(err)
      }
    },

    async likeThread(_, { id }, context) {
      const user = checkAuth(context)

      try {
        const thread = await Thread.findById(id)

        if (thread) {
          if (thread.likes.find((like) => like.username === user.username)) {
            thread.likes = thread.likes.filter((like) => like.username !== user.username)
          } else {
            thread.likes.push({
              id: user.id,
              username: user.username,
              picture: user.picture || '',
              createdAt: new Date().toISOString()
            })
          }
          await thread.save()
          return thread
        }
        throw new UserInputError('Thread not found')
      } catch (err) {
        throw new Error(err)
      }
    }
  }
};

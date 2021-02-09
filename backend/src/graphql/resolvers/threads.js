const { AuthenticationError, UserInputError } = require('apollo-server-express');
const Mongoose = require('mongoose');

const Thread = require('../../models/Thread');
const Answer = require('../../models/Answer');
const checkAuth = require('../../util/checkAuth');

module.exports = {
  Query: {
    async getThreads(_, { boardId, limit = 10, offset = 0 }) {
      try {
        const threads = await Thread.paginate({ boardId }, { sort: { createdAt: -1 }, offset, limit })
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
        const recentlyThreads = await Thread.paginate({}, { sort: { createdAt: -1, pined: -1 }, offset, limit })
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
        author: [{
          id: user.id,
          username: user.username
        }],
        createdAt: new Date().toISOString()
      })

      const thread = await newThread.save()

      context.pubsub.publish('NEW_THREAD', {
        newThread: thread
      })

      return thread
    },

    async deleteThread(_, { id }, context) {
      const { role } = checkAuth(context)

      try {
        const thread = await Thread.findById(id)

        if (role === 'admin') {
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
            edited: [{
              createdAt: new Date().toISOString()
            }]
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

      const thread = await Thread.findById(id)

      try {
        if (role === 'admin') {
          await Thread.updateOne({ _id: Mongoose.Types.ObjectId(id) }, {
            title,
            body,
            pined,
            closed,
            edited: [{
              createdAt: new Date().toISOString()
            }]
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
      const { username } = checkAuth(context)

      try {
        const thread = await Thread.findById(id)

        if (thread) {
          if (thread.likes.find((like) => like.username === username)) {
            thread.likes = thread.likes.filter((like) => like.username !== username)
          } else {
            thread.likes.push({
              username,
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
  },

  Subscription: {
    newThread: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_THREAD')
    }
  }
};

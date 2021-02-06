const { AuthenticationError, UserInputError } = require('apollo-server-express');
const Mongoose = require('mongoose');

const Thread = require('../../models/Thread');
const checkAuth = require('../../util/checkAuth');

module.exports = {
  Query: {
    async getThreads(_, { boardId }) {
      try {
        const threads = await Thread.find({ boardId }).sort({ createdAt: -1 })
        return threads
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
    async getRecentlyThreads() {
      try {
        const recentlyThreads = await Thread.find().sort({ createdAt: -1 })
        return recentlyThreads
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
      const { username, role } = checkAuth(context)

      try {
        const thread = await Thread.findById(id)

        if (role === 'admin') {
          await thread.delete()
          return 'Thread deleted successfully'
        }

        throw new AuthenticationError('Action not allowed')
      } catch (err) {
        throw new Error(err)
      }
    },

    async editThread(_, { id, title, body }, context) {
      const { username, role } = checkAuth(context)

      if (title.trim() === '') {
        throw new Error('Thread title must not be empty')
      }

      if (body.trim() === '') {
        throw new Error('Thread body must not be empty')
      }

      const thread = await Thread.findById(id)

      try {
        if (username === thread.author.username || role === 'admin') {
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

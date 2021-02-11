const { AuthenticationError, UserInputError } = require('apollo-server-express');
const Mongoose = require('mongoose');

const Thread = require('../../models/Thread');
const Answer = require('../../models/Answer');
const checkAuth = require('../../util/checkAuth');

module.exports = {
  Query: {
    async getAnswers(_, { threadId, limit = 10, offset = 0 }) {
      try {
        const answers = await Answer.paginate({ threadId }, { sort: { createdAt: 1 }, offset, limit })
        return answers.docs
      } catch (err) {
        throw new Error(err)
      }
    }
  },

  Mutation: {
    async createAnswer(_, { threadId, body }, context) {
      const user = checkAuth(context)

      if (body.trim() === '') {
        throw new Error('Answer body must not be empty')
      }

      const thread = await Thread.findById(threadId)

      if (thread.closed) {
        if (user.role !== 'admin') {
          throw new UserInputError('Thread closed')
        }
      }

      const newAnswer = new Answer({
        boardId: thread.boardId, 
        threadId,
        body,
        author: {
          id: user.id,
          username: user.username,
          role: user.role
        },
        createdAt: new Date().toISOString()
      })

      const answer = await newAnswer.save()

      context.pubsub.publish('NEW_ANSWER', {
        newAnswer: answer
      })

      return answer
    },

    async deleteAnswer(_, { id }, context) {
      const { username, role } = checkAuth(context)

      try {
        if (role === 'admin') {
          const answer = await Answer.findById(id)
          await answer.delete()
          return 'Answer deleted successfully'
        }

        throw new AuthenticationError('Action not allowed')
      } catch (err) {
        throw new Error(err)
      }
    },

    async editAnswer(_, { id, body }, context) {
      const { username, role } = checkAuth(context)

      if (body.trim() === '') {
        throw new Error('Answer body must not be empty')
      }

      const answer = await Answer.findById(id)
      const thread = await Thread.findById(answer.threadId)

      if (thread.closed) {
        if (user.role !== 'admin') {
          throw new UserInputError('Thread closed')
        }
      }

      try {
        if (username === answer.author.username || role === 'admin') {
          await Answer.updateOne({ _id: Mongoose.Types.ObjectId(id) }, {
            body,
            edited: {
              createdAt: new Date().toISOString()
            }
          })
          const editedAnswer = await Answer.findById(id)
          return editedAnswer
        }

        throw new AuthenticationError('Action not allowed')
      } catch (err) {
        throw new Error(err)
      }
    },

    async likeAnswer(_, { id }, context) {
      const user = checkAuth(context)

      try {
        const answer = await Answer.findById(id)

        if (answer) {
          if (answer.likes.find((like) => like.username === user.username)) {
            answer.likes = answer.likes.filter((like) => like.username !== user.username)
          } else {
            answer.likes.push({
              id: user.id,
              username: user.username,
              picture: user.picture || '',
              createdAt: new Date().toISOString()
            })
          }
          await answer.save()
          return answer
        }

        throw new UserInputError('Answer not found')
      } catch (err) {
        throw new Error(err)
      }
    }
  },

  Subscription: {
    newAnswer: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_ANSWER')
    }
  }
};

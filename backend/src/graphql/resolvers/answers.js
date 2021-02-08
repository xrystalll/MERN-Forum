const { AuthenticationError, UserInputError } = require('apollo-server-express');
const Mongoose = require('mongoose');

const Thread = require('../../models/Thread');
const Answer = require('../../models/Answer');
const checkAuth = require('../../util/checkAuth');

module.exports = {
  Query: {
    async getAnswers(_, { threadId, limit = 10 }) {
      try {
        const answers = await Answer.find({ threadId }).sort({ createdAt: -1 }).limit(limit)
        return answers
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

      const newAnswer = new Answer({
        boardId: thread.boardId, 
        threadId,
        body,
        author: [{
          id: user.id,
          username: user.username
        }],
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
        const answer = await Answer.findById(id)

        if (role === 'admin') {
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

      try {
        if (username === answer.author.username || role === 'admin') {
          await Answer.updateOne({ _id: Mongoose.Types.ObjectId(id) }, {
            body,
            edited: [{
              createdAt: new Date().toISOString()
            }]
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
      const { username } = checkAuth(context)

      try {
        const answer = await Answer.findById(id)

        if (answer) {
          if (answer.likes.find((like) => like.username === username)) {
            answer.likes = answer.likes.filter((like) => like.username !== username)
          } else {
            answer.likes.push({
              username,
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

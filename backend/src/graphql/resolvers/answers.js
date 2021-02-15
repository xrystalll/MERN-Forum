const { AuthenticationError, UserInputError } = require('apollo-server-express');
const { withFilter } = require('apollo-server');
const Mongoose = require('mongoose');

const Thread = require('../../models/Thread');
const Answer = require('../../models/Answer');
const Notification = require('../../models/Notification');
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
    async createAnswer(_, { threadId, body, answeredTo }, context) {
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
        answeredTo,
        body: body.substring(0, 1000),
        author: {
          id: user.id,
          username: user.username,
          role: user.role
        },
        createdAt: new Date().toISOString()
      })
      await Thread.updateOne({ _id: Mongoose.Types.ObjectId(threadId) }, { newestAnswer: new Date().toISOString() })

      const answer = await newAnswer.save()

      context.pubsub.publish('NEW_ANSWER', {
        newAnswer: answer
      })

      if (user.id !== thread.author.id.toString()) {
        if (answeredTo === threadId || !answeredTo) {
          const newAnswerToThread = new Notification({
            type: 'answerToThread',
            to: thread.author.id,
            from: {
              id: answer.author.id,
              username: answer.author.username,
              role: answer.author.role
            },
            threadId,
            title: thread.title,
            body: body.substring(0, 1000),
            createdAt: new Date().toISOString(),
            read: false
          })
          const answerToThread = await newAnswerToThread.save()

          context.pubsub.publish('NEW_NOTIFICATION', {
            newNotification: answerToThread
          })
        }

        if (answeredTo && answeredTo !== threadId) {
          const answerTo = await Answer.findById(answeredTo)

          const newAnswerToAnswer = new Notification({
            type: 'answerToAnswer',
            to: answerTo.author.id,
            from: {
              id: answer.author.id,
              username: answer.author.username,
              role: answer.author.role
            },
            threadId,
            title: thread.title,
            body: body.substring(0, 1000),
            createdAt: new Date().toISOString(),
            read: false
          })
          const answerToAnswer = await newAnswerToAnswer.save()

          context.pubsub.publish('NEW_NOTIFICATION', {
            newNotification: answerToAnswer
          })
        }
      }

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
            body: body.substring(0, 1000),
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
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator('NEW_ANSWER'),
        (payload, variables) => payload.newAnswer.threadId.toString() === variables.threadId
      )
    }
  }
};

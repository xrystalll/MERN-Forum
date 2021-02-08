const boardsResolvers = require('./boards');
const threadsResolvers = require('./threads');
const answersResolvers = require('./answers');
const usersResolvers = require('./users');

const Board = require('../../models/Board');
const Thread = require('../../models/Thread');
const Answer = require('../../models/Answer');

module.exports = {
  Board: {
    threadsCount: async (parent) => await Thread.countDocuments({ boardId: parent.id }),
    newestThread: async (parent) => {
      const thread = await Thread.findOne({ boardId: parent.id }).sort({ createdAt: -1 })
      return thread ? thread.createdAt : ''
    },
    answersCount: async (parent) => await Answer.countDocuments({ boardId: parent.id })
  },

  Thread: {
    likeCount: (parent) => parent.likes.length,
    answersCount: async (parent) => await Answer.countDocuments({ threadId: parent.id }),
    newestAnswer: async (parent) => {
      const answer = await Answer.findOne({ threadId: parent.id }).sort({ createdAt: -1 })
      return answer ? answer.createdAt : ''
    },
    boardTitle: async (parent) => {
      const board = await Board.findById(parent.boardId)
      return board.title
    }
  },

  Answer: {
    boardId: async (parent) => {
      const thread = await Thread.findById(parent.threadId)
      return thread.boardId
    },
    likeCount: (parent) => parent.likes.length
  },

  Query: {
    ...boardsResolvers.Query,
    ...threadsResolvers.Query,
    ...answersResolvers.Query,
    ...usersResolvers.Query
  },

  Mutation: {
    ...usersResolvers.Mutation,
    ...boardsResolvers.Mutation,
    ...threadsResolvers.Mutation,
    ...answersResolvers.Mutation
  },

  Subscription: {
    ...threadsResolvers.Subscription,
    ...answersResolvers.Subscription
  }
};

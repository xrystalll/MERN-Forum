const boardsResolvers = require('./boards');
const threadsResolvers = require('./threads');
const answersResolvers = require('./answers');
const usersResolvers = require('./users');

module.exports = {
  Thread: {
    likeCount: (parent) => parent.likes.length
  },

  Answer: {
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

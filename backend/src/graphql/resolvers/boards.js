const { AuthenticationError } = require('apollo-server-express');
const Mongoose = require('mongoose');

const Board = require('../../models/Board');
const checkAuth = require('../../util/checkAuth');

module.exports = {
  Query: {
    async getBoards() {
      try {
        const boards = await Board.find().sort({ position: -1 })
        return boards
      } catch (err) {
        throw new Error(err)
      }
    },

    async getBoard(_, { id }) {
      try {
        const board = await Board.findById(id)
        return board
      } catch (err) {
        throw new Error(err)
      }
    }
  },

  Mutation: {
    async createBoard(_, { title, position }, context) {
      const { role } = checkAuth(context)

      if (title.trim() === '') {
        throw new Error('Board title must not be empty')
      }

      if (!Number.isInteger(position)) {
        throw new Error('Position must be number')
      }

      const newBoard = new Board({
        title,
        position,
        createdAt: new Date().toISOString()
      })

      if (role === 'admin') {
        const board = await newBoard.save()
        return board
      }

      throw new AuthenticationError('Action not allowed')
    },

    async deleteBoard(_, { id }, context) {
      const { role } = checkAuth(context)

      try {
        const board = await Board.findById(id)

        if (role === 'admin') {
          await board.delete()
          return 'Board deleted successfully'
        }

        throw new AuthenticationError('Action not allowed')
      } catch (err) {
        throw new Error(err)
      }
    },

    async editBoard(_, { id, title, position }, context) {
      const { role } = checkAuth(context)

      if (title.trim() === '') {
        throw new Error('Board title must not be empty')
      }

      if (position) {
        if (!Number.isInteger(position)) {
          throw new Error('Position must be number')
        }
      }

      try {
        const obj = position ? { title, position } : { title }

        if (role === 'admin') {
          await Board.updateOne({ _id: Mongoose.Types.ObjectId(id) }, obj)
          const board = await Board.findById(id)
          return board
        }

        throw new AuthenticationError('Action not allowed')
      } catch (err) {
        throw new Error(err)
      }
    }
  }
};

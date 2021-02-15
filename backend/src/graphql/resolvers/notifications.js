const { AuthenticationError } = require('apollo-server-express');
const { withFilter } = require('apollo-server');

const Notification = require('../../models/Notification');
const checkAuth = require('../../util/checkAuth');

module.exports = {
  Query: {
    async getNotifications(_, { userId, limit = 10, offset = 0, sort }) {
      try {
        let sortCreatedAt
        if (sort === 'old') {
          sortCreatedAt = 1
        } else {
          sortCreatedAt = -1
        }

        const notifications = await Notification.paginate({ to: userId }, { sort: { createdAt: sortCreatedAt }, offset, limit })
        return notifications.docs
      } catch (err) {
        throw new Error(err)
      }
    }
  },

  Mutation: {
    async readNotifications(_, { userId }, context) {
      const { id } = checkAuth(context)

      try {
        if (id === userId) {
          await Notification.updateMany({ to: userId, read: false }, { read: true })

          return 'Notifications read successfully'
        }

        throw new AuthenticationError('Action not allowed')
      } catch (err) {
        throw new Error(err)
      }
    },

    async deleteNotifications(_, { userId }, context) {
      const { id } = checkAuth(context)

      try {
        if (id === userId) {
          await Notification.deleteMany({ to: userId })

          return 'Notifications deleted successfully'
        }

        throw new AuthenticationError('Action not allowed')
      } catch (err) {
        throw new Error(err)
      }
    }
  },

  Subscription: {
    newNotification: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator('NEW_NOTIFICATION'),
        (payload, variables) => payload.newNotification.to.toString() === variables.userId
      )
    }
  }
};

import React, { Component } from 'react';

import { NotificationCard } from 'components/Card';
import Errorer from 'components/Errorer';

import { NEW_NOTIFICATION } from 'support/Subscriptions';

class NotificationsList extends Component {
  componentDidMount() {
    this.props.subscribeToMore({
      document: NEW_NOTIFICATION,
      variables: { userId: this.props.user.id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev

        return {
          getNotifications: [
            subscriptionData.data.newNotification,
            ...prev.getNotifications
          ]
        }
      }
    })
  }

  render() {
    const { notifications } = this.props

    return notifications.length ? (
      notifications.map(item => (
        <NotificationCard key={item.id} data={item} />
      ))
    ) : (
      <Errorer message="No notification yet" />
    )
  }
}

export default NotificationsList;

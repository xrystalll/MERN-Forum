import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useSubscription } from '@apollo/client';

import { GET_NOTIFICATIONS } from 'support/Queries';
import { NEW_NOTIFICATION } from 'support/Subscriptions';

const Notificatoins = ({ user }) => {
  const [notification, setNotification] = useState(false)

  const { data: allNotifications, loadingAllnotifications } = useQuery(GET_NOTIFICATIONS, {
    variables: {
      userId: user.id,
      limit: 1
    }
  })

  const { data, loading } = useSubscription(NEW_NOTIFICATION, {
    variables: { userId: user.id }
  })

  useEffect(() => {
    if (!loadingAllnotifications && allNotifications) {
      if (allNotifications.getNotifications.length && allNotifications.getNotifications[0].read === false) {
        setNotification(true)
      }
    }
    if (!loading && data?.newNotification) {
      setNotification(true)
    }
  }, [loading, data, loadingAllnotifications, allNotifications])

  return (
    <Link className="head_act_item notifications" to="/notifications" onClick={() => setNotification(false)}>
      {notification
        ? <i className="bx bx-notification bx-tada"></i>
        : <i className="bx bx-notification"></i>
      }
    </Link>
  )
}

export default Notificatoins;

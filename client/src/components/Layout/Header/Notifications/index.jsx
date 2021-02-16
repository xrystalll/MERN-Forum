import { useEffect, useState } from 'react';
import { useQuery, useSubscription } from '@apollo/client';

import { GET_NOTIFICATIONS } from 'support/Queries';
import { NEW_NOTIFICATION } from 'support/Subscriptions';

import Dropdown from './Dropdown';

const Notifications = ({ user }) => {
  const [notification, setNotification] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const { data, loading } = useSubscription(NEW_NOTIFICATION, {
    variables: { userId: user.id }
  })

  const { data: all, loading: loadingAll } = useQuery(GET_NOTIFICATIONS, {
    variables: {
      userId: user.id,
      limit: 1
    }
  })

  useEffect(() => {
    if (!loadingAll && all) {
      if (all.getNotifications.length && all.getNotifications[0].read === false) {
        setNotification(true)
      }
    }
    if (!loading && data?.newNotification) {
      setNotification(true)
    }
  }, [loading, data, loadingAll, all])

  const openNotifications = () => {
    setNotification(false)
    setDropdownOpen(!dropdownOpen)
  }

  return (
    <li className="head_act_item notifications">
      {notification
        ? <i className="bx bx-notification bx-tada" onClick={openNotifications}></i>
        : <i className="bx bx-notification" onClick={openNotifications}></i>
      }

      {dropdownOpen && (
        <Dropdown
          setDropdownOpen={setDropdownOpen}
          user={user}
        />
      )}
    </li>
  )
}

export default Notifications;

import { useEffect, useState } from 'react';

import Socket, { joinToRoom, leaveFromRoom } from 'support/Socket';

import Dropdown from './Dropdown';

const Notifications = ({ user, token }) => {
  const [notification, setNotification] = useState(JSON.parse(localStorage.getItem('notifications')))
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    if (user.id) joinToRoom('notification:' + user.id)
    return () => {
      if (user.id) leaveFromRoom('notification:' + user.id)
    }
  }, [user.id])

  useEffect(() => {
    Socket.on('newNotification', (data) => {
      localStorage.setItem('notifications', true)
      setNotification(true)
    })
  }, [])

  const openNotifications = () => {
    setDropdownOpen(!dropdownOpen)
  }

  return (
    <li className="head_act_item notifications">
      {notification
        ? <i className="bx bxs-bell bx-tada" onClick={openNotifications}></i>
        : <i className="bx bx-bell" onClick={openNotifications}></i>
      }

      {dropdownOpen && (
        <Dropdown
          setDropdownOpen={setDropdownOpen}
          informer={notification}
          setInformer={setNotification}
          user={user}
          token={token}
        />
      )}
    </li>
  )
}

export default Notifications;

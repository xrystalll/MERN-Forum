import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { StoreContext } from 'store/Store';

import Socket, { joinToRoom, leaveFromRoom } from 'support/Socket';

import Dropdown from './Dropdown';

const Notifications = () => {
  const { user, token, logout, lang } = useContext(StoreContext)
  const history = useHistory()
  const [notification, setNotification] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    joinToRoom('notification:' + user.id, { token })
    return () => {
      leaveFromRoom('notification:' + user.id)
    }
  }, [user.id, token])

  useEffect(() => {
    Socket.on('notificationsCount', (data) => {
      if (data.count > 0) {
        setNotification(true)
      }
    })
    Socket.on('newNotification', (data) => {
      setNotification(true)
    })
    Socket.on('ban', (data) => {
      if (data.user === user.id) {
        localStorage.setItem('ban', user.id)
        history.push('/banned')
        logout()
      }
    })
    // eslint-disable-next-line
  }, [user.id])

  const openNotifications = () => {
    setDropdownOpen(!dropdownOpen)
  }

  return (
    <li className="head_act_item notifications">
      {notification
        ? <i className="bx bxs-bell bx-tada" onClick={openNotifications} />
        : <i className="bx bx-bell" onClick={openNotifications} />
      }

      {dropdownOpen && (
        <Dropdown
          setDropdownOpen={setDropdownOpen}
          informer={notification}
          setInformer={setNotification}
          user={user}
          token={token}
          lang={lang}
        />
      )}
    </li>
  )
}

export default Notifications;

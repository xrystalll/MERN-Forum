import { useEffect, useState } from 'react';

import Dropdown from './Dropdown';

const Notifications = ({ user }) => {
  const [notification, setNotification] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const openNotifications = () => {
    setNotification(false)
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
          user={user}
        />
      )}
    </li>
  )
}

export default Notifications;

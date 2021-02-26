import { useEffect, useRef, useState } from 'react';

import SortNav from 'components/SortNav';
import { Button } from 'components/Button';
import Errorer from 'components/Errorer';
import Loader from 'components/Loader';
import CustomScrollbar from 'components/CustomScrollbar';

import NotificationsList from './NotificationsList';
import './style.css';

const Dropdown = ({ setDropdownOpen, user }) => {
  const dropdown = useRef()
  const [menuHeight, setMenuHeight] = useState(null)
  const [sort, setSort] = useState('default')

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  })

  const handleClickOutside = ({ target }) => {
    if (target.className === 'sort_item' || dropdown.current?.contains(target)) return

    setDropdownOpen(false)
  }

  const [notifications] = useState([])
  const loading = false

  const deleteNotifications = () => {
    console.log('delete notif')
    return
  }

  const readNotifications = () => {
    console.log('read notifs')
    return
  }

  useEffect(() => {
    readNotifications()
  })

  useEffect(() => {
    if (!loading) {
      if (notifications.length) {
        setMenuHeight(dropdown.current?.querySelector('.notif_list').offsetHeight + 16)
      } else {
        setMenuHeight(350)
      }
    } else {
      setMenuHeight(150)
    }
  }, [loading, notifications])

  return (
    <div className="head_dropdown with_notifications" style={{ height: menuHeight }} ref={dropdown}>
      {!loading ? (
        <CustomScrollbar className="navigation__menu">
          {notifications.length ? (
            <div className="notif_list">
              <SortNav links={[
                { title: 'Newest', sort: 'default' },
                { title: 'Oldest', sort: 'old' }
              ]} setSort={setSort} state={sort} />

              <div className="card_item">
                <Button text="Delete all notifications" onClick={deleteNotifications} className="main hollow" />
              </div>

              <NotificationsList
                notifications={notifications}
                user={user}
              />
            </div>
          ) : (
            <Errorer message="Unable to display notification" />
          )}
        </CustomScrollbar>
      ) : (
        <Loader color="#64707d" />
      )}
    </div>
  )
}

export default Dropdown;

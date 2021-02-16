import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import SortNav from 'components/SortNav';
import { Button } from 'components/Button';
import Errorer from 'components/Errorer';
import Loader from 'components/Loader';
import CustomScrollbar from 'components/CustomScrollbar';

import { GET_NOTIFICATIONS } from 'support/Queries';
import { READ_NOTIFICATIONS, DELETE_NOTIFICATIONS } from 'support/Mutations';

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

  const { data, loading, subscribeToMore } = useQuery(GET_NOTIFICATIONS, {
    variables: {
      userId: user.id,
      limit: 10,
      sort
    }
  })

  const [deleteNotifications] = useMutation(DELETE_NOTIFICATIONS, {
    variables: { userId: user.id },
    update(cache) {
      cache.modify({
        fields: {
          getNotifications() {
            return []
          }
        }
      })
    }
  })

  const [readNotifications] = useMutation(READ_NOTIFICATIONS, {
    variables: { userId: user.id }
  })

  useEffect(() => {
    readNotifications()
  })

  useEffect(() => {
    if (!loading) {
      if (data.getNotifications.length) {
        setMenuHeight(dropdown.current?.querySelector('.notif_list').offsetHeight + 16)
      } else {
        setMenuHeight(350)
      }
    } else {
      setMenuHeight(150)
    }
  }, [loading, data])

  return (
    <div className="head_dropdown with_notifications" style={{ height: menuHeight }} ref={dropdown}>
      {!loading ? (
        <CustomScrollbar className="navigation__menu">
          {data ? (
            <div className="notif_list">
              <SortNav links={[
                { title: 'Newest', sort: 'default' },
                { title: 'Oldest', sort: 'old' }
              ]} setSort={setSort} state={sort} />

              <div className="card_item">
                <Button text="Delete all notifications" onClick={deleteNotifications} className="main hollow" />
              </div>

              <NotificationsList
                notifications={data.getNotifications}
                user={user}
                subscribeToMore={subscribeToMore}
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

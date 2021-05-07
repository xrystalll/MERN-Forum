import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { BACKEND, Strings } from 'support/Constants';
import Socket from 'support/Socket';

import { Button } from 'components/Button';
import Errorer from 'components/Errorer';
import Loader from 'components/Loader';
import CustomScrollbar from 'components/CustomScrollbar';

import NotificationsList from './NotificationsList';
import './style.css';

const Dropdown = ({ setDropdownOpen, informer, setInformer, user, token, lang }) => {
  const dropdown = useRef()
  const [menuHeight, setMenuHeight] = useState(null)

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
    // eslint-disable-next-line
  }, [])

  const handleClickOutside = ({ target }) => {
    if (target.nodeName === 'A') {
      setDropdownOpen(false)
    }
    if (dropdown.current?.contains(target)) return

    setDropdownOpen(false)
  }

  useEffect(() => {
    setInformer(false)
    // eslint-disable-next-line
  }, [informer])

  const [notifications, setNotifications] = useState([])
  const [page, setPage] = useState(1)
  const [nextPage, setNextPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(true)
  const limit = 10
  const [loading, setLoading] = useState(true)
  const [moreLoading, setMoreLoading] = useState(false)
  const [noData, setNoData] = useState(false)
  const [moreTrigger, setMoreTrigger] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (notifications.length) {
        setMenuHeight(dropdown.current?.querySelector('.notif_list').offsetHeight + 16)
      } else {
        setMenuHeight(260)
      }
    } else {
      setMenuHeight(190)
    }
  }, [loading, notifications, noData])

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!hasNextPage) return
      setMoreLoading(true)

      try {
        const data = await fetch(`${BACKEND}/api/notifications?limit=${limit}&page=${page}`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
        const response = await data.json()

        if (!response.error) {
          setNotifications(prev => [...prev, ...response.docs])
          setNextPage(response.nextPage)
          setHasNextPage(response.hasNextPage)
          setLoading(false)
          setMoreLoading(false)
          setNoData(false)
          setMoreTrigger(true)
        } else throw Error(response.error?.message || 'Error')
      } catch(err) {
        setLoading(false)
        setNoData(true)
        setMoreLoading(false)
      }
    }

    fetchNotifications()
    // eslint-disable-next-line
  }, [page])

  const handleScroll = () => {
    if (!moreTrigger) return

    const scrollTop = document.querySelector('.head_dropdown.with_notifications').scrollHeight +
      document.querySelector('.navigation__menu').scrollTop
    const scrollHeight = document.querySelector('.notif_list').scrollHeight
    if (scrollTop >= scrollHeight - 150) {
      setMoreTrigger(false)
      setPage(nextPage)
    }
  }

  useEffect(() => {
    Socket.on('newNotification', (data) => {
      setNotifications(prev => [data, ...prev])
    })
  }, [])

  const deleteNotifications = () => {
    if (!notifications.length) return

    fetch(BACKEND + '/api/notifications/delete', {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          setNotifications([])
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
  }

  return (
    <div className="head_dropdown with_notifications" style={{ height: menuHeight }} ref={dropdown}>
      {!noData ? (
        !loading ? (
          <CustomScrollbar className="navigation__menu" onScroll={handleScroll}>
            <div className="notif_list">
              {notifications.length ? (
                <div className="card_item">
                  <Button
                    text={Strings.deleteAllNotifications[lang]}
                    onClick={deleteNotifications}
                    className="main hollow"
                  />
                </div>
              ) : null}

              <NotificationsList notifications={notifications} lang={lang} />

              {moreLoading && <Loader className="more_loader" color="#64707d" />}
            </div>
          </CustomScrollbar>
        ) : <Loader color="#64707d" />
      ) : (
        <Errorer message={Strings.unableToDisplayNotifications[lang]} />
      )}
    </div>
  )
}

export default Dropdown;

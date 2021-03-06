import { Fragment, useEffect, useState } from 'react';

import { BACKEND } from 'support/Constants';

import { UserCard } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const Online = () => {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [nextPage, setNextPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(true)
  const limit = 10
  const [loading, setLoading] = useState(true)
  const [moreLoading, setMoreLoading] = useState(false)
  const [noData, setNoData] = useState(false)
  const [moreTrigger, setMoreTrigger] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      if (!hasNextPage) return
      setMoreLoading(true)

      try {
        const data = await fetch(`${BACKEND}/api/users?limit=${limit}&page=${page}&sort=online`)
        const response = await data.json()

        if (!response.error) {
          setUsers(prev => [...prev, ...response.docs])
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

    fetchUsers()
  }, [page])

  useEffect(() => {
    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  })

  const handleScroll = () => {
    if (!moreTrigger) return

    const scrollTop = window.innerHeight + document.documentElement.scrollTop
    const scrollHeight = document.scrollingElement.scrollHeight
    if (scrollTop >= scrollHeight - 150) {
      setMoreTrigger(false)
      setPage(nextPage)
    }
  }

  return !noData ? (
    !loading ? (
      users.length ? (
        <Fragment>
          <div className="items_list">
            {users.map(item => (
              <UserCard key={item._id} data={item} />
            ))}
          </div>

          {moreLoading && <Loader className="more_loader" color="#64707d" />}
        </Fragment>
      ) : <Errorer message="No users yet" />
    ) : <Loader color="#64707d" />
  ) : <Errorer message="Unable to display users" />
}

export default Online;

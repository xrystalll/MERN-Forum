import { useEffect, useState } from 'react';

import { UserCard } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const Old = () => {
  const [init, setInit] = useState(true)
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const limit = 10
  const [loading, setLoading] = useState(true)
  const [noData, setNoData] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await fetch(`${'http://localhost:8000'}/api/users?limit=${limit}&page=${page}&sort=old`)
        const response = await data.json()

        if (!response.error) {
          setInit(false)
          setUsers(response.docs)
          setPage(response.nextPage)
          setHasNextPage(response.hasNextPage)
          setLoading(false)
          setNoData(false)
        } else throw Error(response.error.message)
      } catch(err) {
        setInit(false)
        setLoading(false)
        setNoData(true)
      }
    }

    init && fetchUsers()
  }, [init])

  return !noData ? (
    !loading ? (
      users.length ? (
        users.map(item => (
          <UserCard key={item._id} data={item} />
        ))
      ) : <Errorer message="No users yet" />
    ) : <Loader color="#64707d" />
  ) : <Errorer message="Unable to display users" />
}

export default Old;

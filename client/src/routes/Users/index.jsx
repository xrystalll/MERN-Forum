import { Fragment, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { StoreContext } from 'store/Store';

import { Section } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import SortNav from 'components/SortNav';
import { UserCard } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

import { USERS_QUERY } from 'support/Queries';

const Users = () => {
  document.title = 'Forum | Users'
  const { setPostType, setFabVisible } = useContext(StoreContext)
  const [init, setInit] = useState(true)

  useEffect(() => {
    if (init) {
      setFabVisible(true)
      setPostType({
        type: 'thread',
        id: null
      })
    }
    setInit(false)
  }, [setInit, init, setPostType, setFabVisible])

  const [sort, setSort] = useState('default')
  const { loading, data } = useQuery(USERS_QUERY, {
    variables: {
      sort
    }
  })

  return !loading ? (
    <Section>
      {data ? (
        <Fragment>
          <Breadcrumbs current="Users" links={[
            { title: 'Home', link: '/' }
          ]} />

          <SortNav links={[
            { title: 'By newest', sort: 'default' },
            { title: 'By oldest', sort: 'old' },
            { title: 'Online', sort: 'online' }
          ]} setSort={setSort} state={sort} />

          {data.getUsers.length ? (
            data.getUsers.map(item => (
              <UserCard key={item.id} data={item} />
            ))
          ) : (
            <Errorer message="No users yet" />
          )}
        </Fragment>
      ) : (
        <Fragment>
          <Breadcrumbs current="Error" links={[
            { title: 'Home', link: '/' }
          ]} />
          <Errorer message="Unable to display users" />
        </Fragment>
      )}
    </Section>
  ) : (
    <Loader color="#64707d" />
  )
}

export default Users;

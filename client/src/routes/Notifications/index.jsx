import { Fragment, useEffect, useContext, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import { StoreContext } from 'store/Store';

import { Section } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import SortNav from 'components/SortNav';
import { NotificationCard } from 'components/Card';
import {Button } from 'components/Button';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

import { GET_NOTIFICATIONS } from 'support/Queries';
import { READ_NOTIFICATIONS, DELETE_NOTIFICATIONS } from 'support/Mutations';

const Notifications = () => {
  document.title = 'Forum | Notifications'
  const { user, setPostType, setFabVisible } = useContext(StoreContext)
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
  const { loading, data } = useQuery(GET_NOTIFICATIONS, {
    variables: {
      userId: user.id,
      sort
    }
  })

  const [deleteNotifications] = useMutation(DELETE_NOTIFICATIONS, {
    refetchQueries: [{
      query: GET_NOTIFICATIONS,
      variables: {
        userId: user.id,
        sort
      }
    }],
    variables: { userId: user.id }
  })

  const [readNotifications] = useMutation(READ_NOTIFICATIONS, {
    variables: { userId: user.id }
  })

  useEffect(() => {
    if (data && data.getNotifications.length) {
      if (data.getNotifications[0].read === false) {
        readNotifications()
      }
    }
  }, [data])

  return !loading ? (
    <Section>
      {data ? (
        <Fragment>
          <Breadcrumbs current="Notifications" links={[
            { title: 'Home', link: '/' }
          ]} />

          <SortNav links={[
            { title: 'Newest', sort: 'default' },
            { title: 'Oldest', sort: 'old' }
          ]} setSort={setSort} state={sort} />

          {data.getNotifications.length ? (
            <Fragment>
              {<div className="card_item">
                <Button text="Delete all notifications" onClick={deleteNotifications} className="main hollow" />
              </div>}

              {data.getNotifications.map(item => (
                <NotificationCard key={item.id} data={item} />
              ))}
            </Fragment>
          ) : (
            <Errorer message="No notification yet" />
          )}
        </Fragment>
      ) : (
        <Fragment>
          <Breadcrumbs current="Error" links={[
            { title: 'Home', link: '/' }
          ]} />
          <Errorer message="Unable to display notification" />
        </Fragment>
      )}
    </Section>
  ) : (
    <Loader color="#64707d" />
  )
}

export default Notifications;

import { Fragment, useContext } from 'react';

import { StoreContext } from 'store/Store';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { Strings } from 'support/Constants';

import Breadcrumbs from 'components/Breadcrumbs';
import { Card } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const Threads = ({ userData }) => {
  const { lang } = useContext(StoreContext)
  document.title = 'Forum | ' + userData.displayName + ' / ' + Strings.threads[lang]

  const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'user/threads', params: { userId: userData._id }, auth: true })

  return (
    <Fragment>
      <Breadcrumbs current={Strings.threads[lang]} links={[
        { title: Strings.home[lang], link: '/' },
        { title: Strings.users[lang], link: '/users' },
        { title: userData.displayName, link: '/user/' + userData.name }
      ]} />

      {!noData ? (
        !loading ? (
          items.length ? (
            <Fragment>
              <div className="items_list">
                {items.map(item => (
                  <Card key={item._id} data={item} />
                ))}
              </div>

              {moreLoading && <Loader className="more_loader" color="#64707d" />}
            </Fragment>
          ) : <Errorer message={Strings.noThreadsYet[lang]} />
        ) : <Loader color="#64707d" />
      ) : (
        <Errorer message={Strings.unableToDisplayThreads[lang]} />
      )}
    </Fragment>
  )
}

export default Threads;

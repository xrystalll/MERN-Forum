import { Fragment, useContext } from 'react';

import { StoreContext } from 'store/Store';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { Strings } from 'support/Constants';

import Breadcrumbs from 'components/Breadcrumbs';
import { BannedAll } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const Bans = ({ userData }) => {
  const { lang } = useContext(StoreContext)
  document.title = 'Forum | ' + userData.displayName + ' / ' + Strings.bans[lang]

  const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'user/bans', params: { userId: userData._id }, auth: true })

  return (
    <Fragment>
      <Breadcrumbs current={Strings.bans[lang]} links={[
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
                  <BannedAll key={item._id} data={item} />
                ))}
              </div>

              {moreLoading && <Loader className="more_loader" color="#64707d" />}
            </Fragment>
          ) : <Errorer message={Strings.noBansYet[lang]} />
        ) : <Loader color="#64707d" />
      ) : (
        <Errorer message={Strings.unableToDisplayBans[lang]} />
      )}
    </Fragment>
  )
}

export default Bans;

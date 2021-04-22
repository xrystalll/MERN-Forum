import { Fragment, useContext } from 'react';

import { StoreContext } from 'store/Store';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { Strings } from 'support/Constants';

import Breadcrumbs from 'components/Breadcrumbs';
import DataView from 'components/DataView';
import { BannedAll } from 'components/Card';

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

      <DataView
        data={items}
        noData={noData}
        loading={loading}
        moreLoading={moreLoading}
        card={BannedAll}
        noDataMessage={Strings.noBansYet[lang]}
        errorMessage={Strings.unableToDisplayBans[lang]}
      />
    </Fragment>
  )
}

export default Bans;

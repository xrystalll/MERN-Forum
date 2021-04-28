import { useContext } from 'react';

import { StoreContext } from 'store/Store';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { Strings } from 'support/Constants';

import Breadcrumbs from 'components/Breadcrumbs';
import DataView from 'components/DataView';
import { UserCard } from 'components/Card';

const Admins = () => {
  const { lang } = useContext(StoreContext)
  document.title = 'Forum | ' + Strings.admins[lang]

  const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'admins' })

  return (
    <>
      <Breadcrumbs current={Strings.admins[lang]} links={[
        { title: Strings.home[lang], link: '/' },
        { title: Strings.dashboard[lang], link: '/dashboard' }
      ]} />

      <DataView
        data={items}
        noData={noData}
        loading={loading}
        moreLoading={moreLoading}
        card={UserCard}
        noDataMessage={Strings.noAdminsYet[lang]}
        errorMessage={Strings.unableToDisplayUsers[lang]}
      />
    </>
  )
}

export default Admins;

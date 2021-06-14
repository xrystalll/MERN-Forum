import { useContext } from 'react';

import { StoreContext } from 'store/Store';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { Strings } from 'support/Constants';

import { SectionHeader } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import DataView from 'components/DataView';
import { Card } from 'components/Card';

const Threads = ({ userData }) => {
  const { lang } = useContext(StoreContext)
  document.title = 'Forum | ' + userData.displayName + ' / ' + Strings.threads[lang]

  const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'user/threads', params: { userId: userData._id }, auth: true })

  return (
    <>
      <Breadcrumbs current={Strings.threads[lang]} links={[
        { title: Strings.home[lang], link: '/' },
        { title: Strings.users[lang], link: '/users' },
        { title: userData.displayName, link: '/user/' + userData.name }
      ]} />

      <SectionHeader title={Strings.threads[lang]} />

      <DataView
        data={items}
        noData={noData}
        loading={loading}
        moreLoading={moreLoading}
        card={Card}
        noDataMessage={Strings.noThreadsYet[lang]}
        errorMessage={Strings.unableToDisplayThreads[lang]}
      />
    </>
  )
}

export default Threads;

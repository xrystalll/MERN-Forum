import { useContext } from 'react';

import { StoreContext } from 'store/Store';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { Strings } from 'support/Constants';

import DataView from 'components/DataView';
import { NotificationCard } from 'components/Card';

const Unread = () => {
  const { lang } = useContext(StoreContext)
  const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'reports', auth: true })

  return (
    <DataView
      data={items}
      noData={noData}
      loading={loading}
      moreLoading={moreLoading}
      card={NotificationCard}
      noDataMessage={Strings.noReportsYet[lang]}
      errorMessage={Strings.unableToDisplayReports[lang]}
    />
  )
}

export default Unread;

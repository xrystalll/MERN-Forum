import { useContext } from 'react';

import { StoreContext } from 'store/Store';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { Strings } from 'support/Constants';

import DataView from 'components/DataView';
import { BannedAll } from 'components/Card';

const All = () => {
  const { lang } = useContext(StoreContext)
  const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'bans', sort: 'all' })

  return (
    <DataView
      data={items}
      noData={noData}
      loading={loading}
      moreLoading={moreLoading}
      card={BannedAll}
      noDataMessage={Strings.noBansYet[lang]}
      errorMessage={Strings.unableToDisplayBans[lang]}
    />
  )
}

export default All;

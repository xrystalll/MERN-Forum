import { useMoreFetch } from 'hooks/useMoreFetch';

import { Strings } from 'support/Constants';

import DataView from 'components/DataView';
import { UserCard } from 'components/Card';

const Karma = ({ lang }) => {
  const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'users', sort: 'karma' })

  return (
    <DataView
      data={items}
      noData={noData}
      loading={loading}
      moreLoading={moreLoading}
      card={(props) => <UserCard {...props} online karma />}
      noDataMessage={Strings.noUsersYet[lang]}
      errorMessage={Strings.unableToDisplayUsers[lang]}
    />
  )
}

export default Karma;

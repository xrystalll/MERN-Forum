import { useMoreFetch } from 'hooks/useMoreFetch';

import { Strings } from 'support/Constants';

import DataView from 'components/DataView';
import { UserCard } from 'components/Card';

const Online = ({ lang }) => {
  const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'users', sort: 'online' })

  return (
    <DataView
      data={items}
      noData={noData}
      loading={loading}
      moreLoading={moreLoading}
      card={(props) => <UserCard {...props} online />}
      noDataMessage={Strings.noUsersYet[lang]}
      errorMessage={Strings.unableToDisplayUsers[lang]}
    />
  )
}

export default Online;

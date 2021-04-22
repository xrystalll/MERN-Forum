import { useMoreFetch } from 'hooks/useMoreFetch';

import { Strings } from 'support/Constants';

import DataView from 'components/DataView';
import { Card } from 'components/Card';

const Answers = ({ boardId, lang }) => {
  const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'threads', params: { boardId }, sort: 'answersCount' })

  return (
    <DataView
      data={items}
      noData={noData}
      loading={loading}
      moreLoading={moreLoading}
      card={(props) => <Card {...props} preview />}
      noDataMessage={Strings.noThreadsYet[lang]}
      errorMessage={Strings.unableToDisplayThreads[lang]}
    />
  )
}

export default Answers;

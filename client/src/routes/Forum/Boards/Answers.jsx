import { useMoreFetch } from 'hooks/useMoreFetch';

import { Strings } from 'support/Constants';

import DataView from 'components/DataView';
import { BoardCard } from 'components/Card';

const Answers = ({ lang }) => {
  const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'boards', sort: 'answersCount' })

  return (
    <DataView
      data={items}
      noData={noData}
      loading={loading}
      moreLoading={moreLoading}
      card={BoardCard}
      noDataMessage={Strings.noBoardsYet[lang]}
      errorMessage={Strings.unableToDisplayBoards[lang]}
    />
  )
}

export default Answers;

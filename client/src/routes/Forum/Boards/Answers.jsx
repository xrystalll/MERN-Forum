import { Fragment } from 'react';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { Strings } from 'support/Constants';

import { BoardCard } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const Answers = ({ lang }) => {
  const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'boards', sort: 'answersCount' })

  return !noData ? (
    !loading ? (
      items.length ? (
        <Fragment>
          <div className="items_list">
            {items.map(item => (
              <BoardCard key={item._id} data={item} />
            ))}
          </div>

          {moreLoading && <Loader className="more_loader" color="#64707d" />}
        </Fragment>
      ) : <Errorer message={Strings.noBoardsYet[lang]} />
    ) : <Loader color="#64707d" />
  ) : <Errorer message={Strings.unableToDisplayBoards[lang]} />
}

export default Answers;

import { Fragment } from 'react';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { Strings } from 'support/Constants';

import { Card } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const Default = ({ boardId, lang }) => {
  const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'threads', params: { boardId } })

  return !noData ? (
    !loading ? (
      items.length ? (
        <Fragment>
          <div className="items_list">
            {items.map(item => (
              <Card key={item._id} data={item} />
            ))}
          </div>

          {moreLoading && <Loader className="more_loader" color="#64707d" />}
        </Fragment>
      ) : <Errorer message={Strings.noThreadsYet[lang]} />
    ) : <Loader color="#64707d" />
  ) : <Errorer message={Strings.unableToDisplayThreads[lang]} />
}

export default Default;

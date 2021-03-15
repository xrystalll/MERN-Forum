import { Fragment, useContext } from 'react';

import { StoreContext } from 'store/Store';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { Strings } from 'support/Constants';

import { BannedAll } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const All = () => {
  const { lang } = useContext(StoreContext)
  const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'bans', sort: 'all' })

  return !noData ? (
    !loading ? (
      items.length ? (
        <Fragment>
          <div className="items_list">
            {items.map(item => (
              <BannedAll key={item._id} data={item} />
            ))}
          </div>

          {moreLoading && <Loader className="more_loader" color="#64707d" />}
        </Fragment>
      ) : <Errorer message={Strings.noBansYet[lang]} />
    ) : <Loader color="#64707d" />
  ) : <Errorer message={Strings.unableToDisplayBans[lang]} />
}

export default All;

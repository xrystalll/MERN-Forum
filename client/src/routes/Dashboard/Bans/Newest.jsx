import { Fragment, useContext } from 'react';
import { toast } from 'react-toastify';

import { StoreContext } from 'store/Store';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { BACKEND, Strings } from 'support/Constants';

import { BannedCard } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const Newest = () => {
  const { token, lang } = useContext(StoreContext)
  const { loading, moreLoading, noData, items, setItems, setNoData } = useMoreFetch({ method: 'bans' })

  const unBan = (userId) => {
    fetch(BACKEND + '/api/ban/delete', {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    })
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          setItems(items.filter(item => item._id !== userId))
          if (items.filter(item => item._id !== userId).length === 0) {
            setItems([])
            setNoData(true)
          }
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => toast.error(err.message))
  }

  return !noData ? (
    !loading ? (
      items.length ? (
        <Fragment>
          <div className="items_list">
            {items.map(item => (
              <BannedCard key={item._id} data={item} unBan={unBan} />
            ))}
          </div>

          {moreLoading && <Loader className="more_loader" color="#64707d" />}
        </Fragment>
      ) : <Errorer message={Strings.noBansYet[lang]} />
    ) : <Loader color="#64707d" />
  ) : <Errorer message={Strings.unableToDisplayBans[lang]} />
}

export default Newest;

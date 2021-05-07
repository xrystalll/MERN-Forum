import { useContext } from 'react';
import { toast } from 'react-toastify';

import { StoreContext } from 'store/Store';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { BACKEND, Strings } from 'support/Constants';

import DataView from 'components/DataView';
import { BannedCard } from 'components/Card';

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
      .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
  }

  return (
    <DataView
      data={items}
      noData={noData}
      loading={loading}
      moreLoading={moreLoading}
      card={(props) => <BannedCard {...props} unBan={unBan} />}
      noDataMessage={Strings.noBansYet[lang]}
      errorMessage={Strings.unableToDisplayBans[lang]}
    />
  )
}

export default Newest;

import { useContext } from 'react';
import { toast } from 'react-toastify';

import { StoreContext } from 'store/Store';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { BACKEND, Strings } from 'support/Constants';

import DataView from 'components/DataView';
import { BannedAll } from 'components/Card';

const All = () => {
  const { token, lang } = useContext(StoreContext)
  const { loading, moreLoading, noData, items, setItems } = useMoreFetch({ method: 'bans', sort: 'all' })

  const deleteBan = (banId) => {
    const conf = window.confirm(`${Strings.delete[lang]}?`)

    if (!conf) return

    fetch(BACKEND + '/api/ban/history/delete', {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ banId })
    })
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          toast.success(data.message)
          setItems(items.filter(item => item._id !== banId))
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
      card={(props) => <BannedAll {...props} deleteBan={deleteBan} />}
      noDataMessage={Strings.noBansYet[lang]}
      errorMessage={Strings.unableToDisplayBans[lang]}
    />
  )
}

export default All;

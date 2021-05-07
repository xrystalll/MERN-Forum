import { useContext } from 'react';
import { toast } from 'react-toastify';

import { StoreContext } from 'store/Store';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { BACKEND, Strings } from 'support/Constants';

import DataView from 'components/DataView';
import { NotificationCard } from 'components/Card';
import { Button } from 'components/Button';

const Unread = () => {
  const { token, lang } = useContext(StoreContext)
  const { loading, moreLoading, noData, items, setItems } = useMoreFetch({ method: 'reports', sort: 'read', auth: true })

  const deleteReports = () => {
    if (!items.length) return

    fetch(BACKEND + '/api/reports/delete', {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          setItems([])
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
      card={NotificationCard}
      noDataMessage={Strings.noReportsYet[lang]}
      errorMessage={Strings.unableToDisplayReports[lang]}
    >
      <div className="card_item">
        <Button
          className="main hollow"
          text={Strings.deleteAll[lang]}
          onClick={deleteReports}
        />
      </div>
    </DataView>
  )
}

export default Unread;

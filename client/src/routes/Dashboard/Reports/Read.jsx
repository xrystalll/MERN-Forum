import { Fragment, useContext } from 'react';
import { toast } from 'react-toastify';

import { StoreContext } from 'store/Store';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { BACKEND, Strings } from 'support/Constants';

import { NotificationCard } from 'components/Card';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

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
      .catch(err => toast.error(err.message))
  }

  return !noData ? (
    !loading ? (
      items.length ? (
        <Fragment>
          <div className="card_item">
            <Button
              className="main hollow"
              text={Strings.deleteAll[lang]}
              onClick={deleteReports}
            />
          </div>

          <div className="items_list">
            {items.map(item => (
              <NotificationCard key={item._id} data={item} />
            ))}
          </div>

          {moreLoading && <Loader className="more_loader" color="#64707d" />}
        </Fragment>
      ) : <Errorer message={Strings.noReportsYet[lang]} />
    ) : <Loader color="#64707d" />
  ) : <Errorer message={Strings.unableToDisplayReports[lang]} />
}

export default Unread;

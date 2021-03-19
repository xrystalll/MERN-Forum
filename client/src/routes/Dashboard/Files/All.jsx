import { Fragment, useContext } from 'react';
import { toast } from 'react-toastify';

import { StoreContext } from 'store/Store';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { BACKEND, Strings } from 'support/Constants';

import { FileCard } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const All = () => {
  const { lang, token } = useContext(StoreContext)
  const { loading, moreLoading, noData, items, setItems } = useMoreFetch({ method: 'files/all/admin', sort: 'moderated', auth: true })

  const deleteFile = (fileId) => {
    fetch(BACKEND + '/api/file/delete', {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileId })
    })
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          toast.success(data.message)
          setItems(items.filter(item => item._id !== fileId))
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
              <FileCard key={item._id} data={item} deleteFile={deleteFile} />
            ))}
          </div>

          {moreLoading && <Loader className="more_loader" color="#64707d" />}
        </Fragment>
      ) : <Errorer message={Strings.noFilesYet[lang]} />
    ) : <Loader color="#64707d" />
  ) : <Errorer message={Strings.unableToDisplayFiles[lang]} />
}

export default All;

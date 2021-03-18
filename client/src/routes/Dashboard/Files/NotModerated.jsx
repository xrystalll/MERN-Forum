import { Fragment, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

import { StoreContext } from 'store/Store';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { BACKEND, Strings } from 'support/Constants';

import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

import FileItem from './FileItem';

const NotModerated = () => {
  const { lang, token } = useContext(StoreContext)
  const { loading, moreLoading, noData, items, setItems } = useMoreFetch({ method: 'files/all/admin', auth: true })

  useEffect(() => {
    localStorage.removeItem('files')
  }, [])

  const moderate = (type, fileId) => {
    const action = type === 'delete' ? 'delete' : 'moderate'

    fetch(BACKEND + '/api/file/' + action, {
      method: type === 'delete' ? 'DELETE' : 'PUT',
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
              <FileItem
                key={item._id}
                data={item}
                moderate={moderate}
                lang={lang}
              />
            ))}
          </div>

          {moreLoading && <Loader className="more_loader" color="#64707d" />}
        </Fragment>
      ) : <Errorer message={Strings.noFilesYet[lang]} />
    ) : <Loader color="#64707d" />
  ) : <Errorer message={Strings.unableToDisplayFiles[lang]} />
}

export default NotModerated;

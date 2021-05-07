import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

import { StoreContext } from 'store/Store';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { BACKEND, Strings } from 'support/Constants';

import DataView from 'components/DataView';

import FileItem from './FileItem';

const NotModerated = () => {
  const { lang, token } = useContext(StoreContext)
  const { loading, moreLoading, noData, items, setItems } = useMoreFetch({ method: 'files/all/admin', auth: true })

  useEffect(() => {
    localStorage.removeItem('files')
  }, [])

  const moderate = (type, fileId) => {
    const action = type === 'delete' ? 'delete' : 'moderate'

    if (type === 'delete') {
      const conf = window.confirm(`${Strings.delete[lang]}?`)

      if (!conf) return
    }

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
      .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
  }

  return (
    <DataView
      data={items}
      noData={noData}
      loading={loading}
      moreLoading={moreLoading}
      card={(props) => <FileItem {...props} moderate={moderate} lang={lang} />}
      noDataMessage={Strings.noFilesYet[lang]}
      errorMessage={Strings.unableToDisplayFiles[lang]}
    />
  )
}

export default NotModerated;

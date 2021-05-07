import { useContext } from 'react';
import { toast } from 'react-toastify';

import { StoreContext } from 'store/Store';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { BACKEND, Strings } from 'support/Constants';

import DataView from 'components/DataView';
import { FileCard } from 'components/Card';

const All = () => {
  const { lang, token } = useContext(StoreContext)
  const { loading, moreLoading, noData, items, setItems } = useMoreFetch({ method: 'files/all/admin', sort: 'moderated', auth: true })

  const deleteFile = (fileId) => {
    const conf = window.confirm(`${Strings.delete[lang]}?`)

    if (!conf) return

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
      .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
  }

  return (
    <DataView
      data={items}
      noData={noData}
      loading={loading}
      moreLoading={moreLoading}
      card={(props) => <FileCard {...props} deleteFile={deleteFile} />}
      noDataMessage={Strings.noFilesYet[lang]}
      errorMessage={Strings.unableToDisplayFiles[lang]}
    />
  )
}

export default All;

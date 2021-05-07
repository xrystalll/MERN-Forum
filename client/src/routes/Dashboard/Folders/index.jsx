import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { StoreContext } from 'store/Store';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { BACKEND, Strings } from 'support/Constants';

import Breadcrumbs from 'components/Breadcrumbs';
import { Button } from 'components/Button';
import DataView from 'components/DataView';

import { FolderItem, NewFolderItem } from './FolderItem';

const Folders = () => {
  const { token, lang } = useContext(StoreContext)
  document.title = 'Forum | ' + Strings.manageUploadsFolders[lang]

  const { loading, moreLoading, noData, items, setItems, setNoData } = useMoreFetch({ method: 'folders' })
  const [create, setCreate] = useState(false)
  const [fetchErrors, setFetchErros] = useState({})

  const createFolder = (data) => {
    fetch(BACKEND + '/api/folder/create', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          setNoData(false)
          setCreate(false)
          setItems(prev => [data, ...prev])
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => {
        setFetchErros({ generalCreate: err.message === '[object Object]' ? 'Error' : err.message })
      })
  }

  const editFolder = (data) => {
    fetch(BACKEND + '/api/folder/edit', {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          let newArray = [...items]
          newArray[newArray.findIndex(item => item._id === data._id)] = data

          setItems(newArray)
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => {
        setFetchErros({ [data.folderId]: err.message === '[object Object]' ? 'Error' : err.message })
      })
  }

  const deleteFolder = (folderId) => {
    fetch(BACKEND + '/api/board/delete', {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ folderId })
    })
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          setItems(items.filter(item => item._id !== folderId))
          if (items.filter(item => item._id !== folderId).length === 0) {
            setItems([])
            setNoData(true)
          }
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
  }

  return (
    <>
      <Breadcrumbs current={Strings.manageUploadsFolders[lang]} links={[
        { title: Strings.home[lang], link: '/' },
        { title: Strings.dashboard[lang], link: '/dashboard' }
      ]} />

      <div className="card_item">
        <Button
          className="main hollow"
          text={Strings.createNewFolder[lang]}
          onClick={() => setCreate(!create)}
        />
      </div>

      {create && (
        <NewFolderItem
          lang={lang}
          createFolder={createFolder}
          setCreate={setCreate}
          fetchErrors={fetchErrors}
          setFetchErros={setFetchErros}
        />
      )}

      <DataView
        data={items}
        noData={noData}
        loading={loading}
        moreLoading={moreLoading}
        card={(props) => (
          <FolderItem
            {...props}
            lang={lang}
            editFolder={editFolder}
            deleteFolder={deleteFolder}
            fetchErrors={fetchErrors}
            setFetchErros={setFetchErros}
          />
        )}
        noDataMessage={Strings.noFoldersYet[lang]}
        errorMessage={Strings.unableToDisplayFolders[lang]}
      />
    </>
  )
}

export default Folders;

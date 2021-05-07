import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { StoreContext } from 'store/Store';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { BACKEND, Strings } from 'support/Constants';

import Breadcrumbs from 'components/Breadcrumbs';
import { Button } from 'components/Button';
import DataView from 'components/DataView';

import { BoardItem, NewBoardItem } from './BoardItem';
import './style.css';

const Boards = () => {
  const { token, lang } = useContext(StoreContext)
  document.title = 'Forum | ' + Strings.manageBoards[lang]

  const { loading, moreLoading, noData, items, setItems, setNoData } = useMoreFetch({ method: 'boards' })
  const [create, setCreate] = useState(false)
  const [fetchErrors, setFetchErros] = useState({})

  const createBoard = (data) => {
    fetch(BACKEND + '/api/board/create', {
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

  const editBoard = (data) => {
    fetch(BACKEND + '/api/board/edit', {
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
        setFetchErros({ [data.boardId]: err.message === '[object Object]' ? 'Error' : err.message })
      })
  }

  const deleteBoard = (boardId) => {
    fetch(BACKEND + '/api/board/delete', {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ boardId })
    })
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          setItems(items.filter(item => item._id !== boardId))
          if (items.filter(item => item._id !== boardId).length === 0) {
            setItems([])
            setNoData(true)
          }
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
  }

  return (
    <>
      <Breadcrumbs current={Strings.manageBoards[lang]} links={[
        { title: Strings.home[lang], link: '/' },
        { title: Strings.dashboard[lang], link: '/dashboard' }
      ]} />

      <div className="card_item">
        <Button
          className="main hollow"
          text={Strings.createNewBoard[lang]}
          onClick={() => setCreate(!create)}
        />
      </div>

      {create && (
        <NewBoardItem
          lang={lang}
          createBoard={createBoard}
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
          <BoardItem
            {...props}
            lang={lang}
            editBoard={editBoard}
            deleteBoard={deleteBoard}
            fetchErrors={fetchErrors}
            setFetchErros={setFetchErros}
          />
        )}
        noDataMessage={Strings.noBoardsYet[lang]}
        errorMessage={Strings.unableToDisplayBoards[lang]}
      />
    </>
  )
}

export default Boards;

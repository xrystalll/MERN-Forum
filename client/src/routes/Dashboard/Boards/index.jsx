import { Fragment, useContext, useEffect, useState } from 'react';

import { StoreContext } from 'store/Store';

import { BACKEND } from 'support/Constants';

import Breadcrumbs from 'components/Breadcrumbs';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';
import { BoardItem, NewBoardItem } from './BoardItem';
import './style.css';

const Boards = () => {
  document.title = 'Forum | Manage boards'
  const { token } = useContext(StoreContext)

  const [boards, setBoards] = useState([])
  const [page, setPage] = useState(1)
  const [nextPage, setNextPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(true)
  const limit = 10
  const [loading, setLoading] = useState(true)
  const [moreLoading, setMoreLoading] = useState(false)
  const [noData, setNoData] = useState(false)
  const [moreTrigger, setMoreTrigger] = useState(true)
  const [create, setCreate] = useState(false)
  const [fetchErrors, setFetchErros] = useState({})

  useEffect(() => {
    const fetchBoards = async () => {
      if (!hasNextPage) return
      setMoreLoading(true)

      try {
        const data = await fetch(`${BACKEND}/api/boards?limit=${limit}&page=${page}`)
        const response = await data.json()

        if (!response.error) {
          setBoards(prev => [...prev, ...response.docs])
          setNextPage(response.nextPage)
          setHasNextPage(response.hasNextPage)
          setLoading(false)
          setMoreLoading(false)
          setNoData(false)
          setMoreTrigger(true)
        } else throw Error(response.error?.message || 'Error')
      } catch(err) {
        setLoading(false)
        setNoData(true)
        setMoreLoading(false)
      }
    }

    fetchBoards()
  }, [page])

  useEffect(() => {
    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  })

  const handleScroll = () => {
    if (!moreTrigger) return

    const scrollTop = window.innerHeight + document.documentElement.scrollTop
    const scrollHeight = document.scrollingElement.scrollHeight
    if (scrollTop >= scrollHeight - 150) {
      setMoreTrigger(false)
      setPage(nextPage)
    }
  }

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
          setBoards(prev => [data, ...prev])
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => {
        setFetchErros({ generalCreate: err.message })
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
          let newArray = [...boards]
          newArray[newArray.findIndex(item => item._id === data._id)] = data

          setBoards(newArray)
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => {
        setFetchErros({ [data.boardId]: err.message })
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
          setBoards(boards.filter(item => item._id !== boardId))
          if (boards.filter(item => item._id !== boardId).length === 0) {
            setBoards([])
            setNoData(true)
          }
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => {
        setFetchErros({ general: err.message })
      })
  }

  return (
    <Fragment>
      <Breadcrumbs current="Manage boards" links={[
        { title: 'Home', link: '/' },
        { title: 'Dashboard', link: '/dashboard' }
      ]} />

      <div className="card_item">
        <Button className="main hollow" text="Create new board" onClick={() => setCreate(!create)} />
      </div>

      {create && (
        <NewBoardItem
          createBoard={createBoard}
          setCreate={setCreate}
          fetchErrors={fetchErrors}
          setFetchErros={setFetchErros}
        />
      )}

      {!noData ? (
        !loading ? (
          boards.length ? (
            <Fragment>
              <div className="items_list">
                {boards.map(item => (
                  <BoardItem
                    key={item._id}
                    data={item}
                    editBoard={editBoard}
                    deleteBoard={deleteBoard}
                    fetchErrors={fetchErrors}
                    setFetchErros={setFetchErros}
                  />
                ))}
              </div>

              {moreLoading && <Loader className="more_loader" color="#64707d" />}
            </Fragment>
          ) : <Errorer message="No boards yet" />
        ) : <Loader color="#64707d" />
      ) : (
        <Errorer message="Unable to display boards" />
      )}
    </Fragment>
  )
}

export default Boards;

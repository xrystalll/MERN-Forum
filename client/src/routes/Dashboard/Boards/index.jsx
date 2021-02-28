import { Fragment, useContext, useState } from 'react';

import { StoreContext } from 'store/Store';

import { BACKEND } from 'support/Constants';

import Breadcrumbs from 'components/Breadcrumbs';
import Errorer from 'components/Errorer';
import { BoardItem } from './BoardItem';
import './style.css';

const Boards = () => {
  document.title = 'Forum | Manage boards'
  const { token } = useContext(StoreContext)
  // mock data
  const [boards] = useState([
    {
      _id: 1,
      title: 'Board 1',
      position: 1,
      threadsCount: 0,
      answersCount: 0
    }, {
      _id: 2,
      title: 'Board 2',
      position: 2,
      threadsCount: 0,
      answersCount: 0
    }, {
      _id: 3,
      title: 'Board 3',
      position: 3,
      threadsCount: 0,
      answersCount: 0
    }, {
      _id: 4,
      title: 'Board 4',
      position: 4,
      threadsCount: 0,
      answersCount: 0
    }
  ])

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
        console.log(data)
      })
      .catch(err => {
        console.error(err)
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
        console.log(data)
      })
      .catch(err => {
        console.error(err)
      })
  }

  return (
    <Fragment>
      <Breadcrumbs current="Manage boards" links={[
        { title: 'Home', link: '/' },
        { title: 'Dashboard', link: '/dashboard' }
      ]} />

      {boards.length ? (
        boards.map(item => (
          <BoardItem key={item._id} data={item} editBoard={editBoard} deleteBoard={deleteBoard} />
        ))
      ) : <Errorer message="No boards yet" />}
    </Fragment>
  )
}

export default Boards;

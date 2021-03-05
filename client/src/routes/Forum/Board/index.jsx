import { Fragment, useContext, useEffect, useState } from 'react';

import { StoreContext } from 'store/Store';

import { BACKEND } from 'support/Constants';

import { Section } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import SortNav from 'components/SortNav';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

import Default from './Default';
import Recently from './Recently';
import Answers from './Answers';

const Board = ({ match }) => {
  const { setPostType, setFabVisible } = useContext(StoreContext)
  const { boardName } = match.params
  const [init, setInit] = useState(true)
  const [board, setBoard] = useState({})
  const [loading, setLoading] = useState(true)
  const [noData, setNoData] = useState(false)
  const [sort, setSort] = useState('default')

  useEffect(() => {
    const boardFullName = board.title || 'Board'
    document.title = 'Forum | ' + boardFullName
    const fetchBoard = async () => {
      try {
        const data = await fetch(`${BACKEND}/api/board?name=${boardName}`)
        const response = await data.json()

        if (!response.error) {
          setInit(false)
          setBoard(response)
          setLoading(false)
          setNoData(false)
        } else throw Error(response.error?.message || 'Error')
      } catch(err) {
        setInit(false)
        setNoData(true)
        setLoading(false)
      }
    }

    init && fetchBoard()
  }, [init, board])

  useEffect(() => {
    setFabVisible(true)
    setPostType({
      type: 'thread',
      id: board._id || null
    })
  }, [board])

  return (
    <Section>
      <Breadcrumbs current={board.title || boardName} links={[
        { title: 'Home', link: '/' },
        { title: 'All boards', link: '/boards' }
      ]} />

      <SortNav links={[
        { title: 'Default', sort: 'default' },
        { title: 'Recently answered', sort: 'recently' },
        { title: 'By answers count', sort: 'answers' }
      ]} setSort={setSort} state={sort} />

      {!noData ? (
        !loading ? (
          <Fragment>
            {sort === 'answers' && <Answers boardId={board._id} />}
            {sort === 'recently' && <Recently boardId={board._id} />}
            {sort === 'default' && <Default boardId={board._id} />}
          </Fragment>
        ) : <Loader color="#64707d" />
      ) : (
        <Errorer message="Unable to display board" />
      )}
    </Section>
  )
}

export default Board;

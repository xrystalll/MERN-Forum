import { useContext, useEffect, useState } from 'react';

import { StoreContext } from 'store/Store';

import { BACKEND, Strings } from 'support/Constants';

import { Section } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import SortNav from 'components/SortNav';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

import Default from './Default';
import Recently from './Recently';
import Answers from './Answers';

const Board = ({ match }) => {
  const { setPostType, setFabVisible, lang } = useContext(StoreContext)
  const { boardName } = match.params
  const [init, setInit] = useState(true)
  const [board, setBoard] = useState({})
  const [loading, setLoading] = useState(true)
  const [noData, setNoData] = useState(false)
  const [sort, setSort] = useState('default')

  useEffect(() => {
    setFabVisible(true)
    setPostType({
      type: 'thread',
      id: board._id || null
    })
    // eslint-disable-next-line
  }, [board])

  useEffect(() => {
    const boardFullName = board.title || Strings.board[lang]
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
  }, [init, board, boardName, lang])

  return (
    <Section>
      <Breadcrumbs current={board.title || boardName} links={[
        { title: Strings.home[lang], link: '/' },
        { title: Strings.allBoards[lang], link: '/boards' }
      ]} />

      <SortNav links={[
        { title: Strings.default[lang], sort: 'default' },
        { title: Strings.recentlyAnswered[lang], sort: 'recently' },
        { title: Strings.byAnswersCount[lang], sort: 'answers' }
      ]} setSort={setSort} state={sort} />

      {!noData ? (
        !loading ? (
          <>
            {sort === 'answers' && <Answers boardId={board._id} lang={lang} />}
            {sort === 'recently' && <Recently boardId={board._id} lang={lang} />}
            {sort === 'default' && <Default boardId={board._id} lang={lang} />}
          </>
        ) : <Loader color="#64707d" />
      ) : (
        <Errorer message={Strings.unableToDisplayBoard[lang]} />
      )}
    </Section>
  )
}

export default Board;

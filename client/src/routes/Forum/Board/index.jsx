import { Fragment, useContext, useEffect, useState } from 'react';

import { StoreContext } from 'store/Store';

import { Section } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import SortNav from 'components/SortNav';
import { Card } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const Board = ({ match }) => {
  document.title = 'Forum | Board'
  const { setPostType, setFabVisible } = useContext(StoreContext)
  const [init, setInit] = useState(true)
  const { boardId } = match.params

  useEffect(() => {
    if (init) {
      setFabVisible(true)
      setPostType({
        type: 'thread',
        id: boardId
      })
    }
    setInit(false)
  }, [setInit, init, setPostType, setFabVisible, boardId])

  const [sort, setSort] = useState('default')

  const sortFunc = (a, b) => {
    switch (sort) {
      case 'answers':
        return b.answersCount - a.answersCount
      case 'recently':
        return a.newestAnswer > b.newestAnswer ? -1 : 1
      default:
        return b.newestAnswer - a.newestAnswer
    }
  }

  const [board] = useState([])
  const [threads] = useState([])
  const loading = false

  return !loading ? (
    <Section>
      <Breadcrumbs current={board[0].title} links={[
        { title: 'Home', link: '/' },
        { title: 'All boards', link: '/boards' }
      ]} />

      <SortNav links={[
        { title: 'Default', sort: 'default' },
        { title: 'Recently answered', sort: 'recently' },
        { title: 'By answers count', sort: 'answers' }
      ]} setSort={setSort} state={sort} />

      {threads.length ? (
        threads.slice().sort(sortFunc).map(item => (
          <Card key={item.id} data={item} />
        ))
      ) : (
        <Errorer message="No threads yet" />
      )}
    </Section>
  ) : (
    <Loader color="#64707d" />
  )
}

export default Board;

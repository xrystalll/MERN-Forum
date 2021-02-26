import { Fragment, useContext, useEffect, useState } from 'react';

import { StoreContext } from 'store/Store';

import { Section } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import SortNav from 'components/SortNav';
import { BoardCard } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const Boards = () => {
  document.title = 'Forum | Boards'
  const { setPostType, setFabVisible } = useContext(StoreContext)
  const [init, setInit] = useState(true)

  useEffect(() => {
    if (init) {
      setFabVisible(true)
      setPostType({
        type: 'thread',
        id: null
      })
    }
    setInit(false)
  }, [setInit, init, setPostType, setFabVisible])

  const [sort, setSort] = useState('default')

  const sortFunc = (a, b) => {
    switch (sort) {
      case 'popular':
        return b.threadsCount - a.threadsCount
      case 'answers':
        return b.answersCount - a.answersCount
      default:
        return b.position - a.position
    }
  }

  const [boards] = useState([])
  const loading = false

  return !loading ? (
    <Section>
      <Breadcrumbs current="All boards" links={[
        { title: 'Home', link: '/' }
      ]} />

      <SortNav links={[
        { title: 'Default', sort: 'default' },
        { title: 'Popular', sort: 'popular' },
        { title: 'Answers count', sort: 'answers' }
      ]} setSort={setSort} state={sort} />

      {boards.length ? (
        boards.slice().sort(sortFunc).map(item => (
          <BoardCard key={item.id} data={item} />
        ))
      ) : (
        <Errorer message="No boards yet" />
      )}
    </Section>
  ) : (
    <Loader color="#64707d" />
  )
}

export default Boards;

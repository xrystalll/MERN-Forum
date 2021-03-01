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
  const { boardName } = match.params
  const boardId = 0

  useEffect(() => {
    if (init) {
      setFabVisible(true)
      setPostType({
        type: 'thread',
        id: boardId
      })
    }
    setInit(false)
  }, [setInit, init, setPostType, setFabVisible, boardName])

  const [sort, setSort] = useState('default')

  const [threads] = useState([])
  const loading = false

  return !loading ? (
    <Section>
      <Breadcrumbs current="Title" links={[
        { title: 'Home', link: '/' },
        { title: 'All boards', link: '/boards' }
      ]} />

      <SortNav links={[
        { title: 'Default', sort: 'default' },
        { title: 'Recently answered', sort: 'recently' },
        { title: 'By answers count', sort: 'answers' }
      ]} setSort={setSort} state={sort} />

      {threads.length ? (
        threads.map(item => (
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

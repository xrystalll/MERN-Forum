import { Fragment, useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import { StoreContext } from 'store/Store';

import { Section } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import SortNav from 'components/SortNav';
import { BoardCard } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const BOARDS_QUERY = gql`
  {
    getBoards {
      id
      title
      position
      threadsCount
      newestThread
      answersCount
    }
  }
`;

const Boards = () => {
  document.title = 'Forum | Boards'
  const { setPostType } = useContext(StoreContext)
  const [init, setInit] = useState(true)

  useEffect(() => {
    init && setPostType({
      type: 'thread',
      id: null
    })
    setInit(false)
  }, [setInit, init, setPostType])

  const { loading, data } = useQuery(BOARDS_QUERY)
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

  return !loading ? (
    <Section>
      {data ? (
        <Fragment>
          <Breadcrumbs current="All boards" links={[
            { title: 'Home', link: '/' }
          ]} />

          <SortNav links={[
            { title: 'Default', sort: 'default' },
            { title: 'Popular', sort: 'popular' },
            { title: 'Answers count', sort: 'answers' }
          ]} setSort={setSort} state={sort} />

          {data.getBoards.length ? (
            data.getBoards.slice().sort(sortFunc).map(item => (
              <BoardCard key={item.id} data={item} />
            ))
          ) : (
            <Errorer message="No boards yet" />
          )}
        </Fragment>
      ) : (
        <Fragment>
          <Breadcrumbs current="Error" links={[
            { title: 'Home', link: '/' }
          ]} />
          <Errorer message="Unable to display boards" />
        </Fragment>
      )}
    </Section>
  ) : (
    <Loader color="#64707d" />
  )
}

export default Boards;

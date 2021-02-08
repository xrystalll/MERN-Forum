import { Fragment, useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import { StoreContext } from 'store/Store';

import { Section } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import SortNav from 'components/SortNav';
import { Card } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const THREADS_QUERY = gql`
  query($boardId: ID!) {
    getThreads(boardId: $boardId) {
      id
      boardId
      pined
      closed
      title
      createdAt
      author {
        id
        username
      }
      likes {
        username
      }
      newestAnswer
      answersCount
    }
    getBoard(id: $boardId) {
      title
    }
  }
`;

const Board = ({ match }) => {
  const { setPostType } = useContext(StoreContext)
  const [init, setInit] = useState(true)
  const { boardId } = match.params

  useEffect(() => {
    init && setPostType({
      type: 'thread',
      id: boardId
    })
    setInit(false)
  }, [setInit, init, setPostType, boardId])

  const { loading, data } = useQuery(THREADS_QUERY, {
    variables: {
      boardId
    }
  })
  const [sort, setSort] = useState('default')

  const sortFunc = (a, b) => {
    switch (sort) {
      case 'answers':
        return b.answersCount - a.answersCount
      default:
        return b.newestAnswer - a.newestAnswer
    }
  }

  return !loading ? (
    <Section>
      {data ? (
        <Fragment>
          <Breadcrumbs current={data.getBoard.title} links={[
            { title: 'Home', link: '/' },
            { title: 'All boards', link: '/boards' }
          ]} />

          <SortNav links={[
            { title: 'Default', sort: 'default' },
            { title: 'Recently', sort: 'recently' },
            { title: 'By answers count', sort: 'answers' }
          ]} setSort={setSort} state={sort} />

          {data.getThreads.length ? (
            data.getThreads.slice().sort(sortFunc).map(item => (
              <Card key={item.id} data={item} />
            ))
          ) : (
            <Errorer message="No threads yet" />
          )}
        </Fragment>
      ) : (
        <Fragment>
          <Breadcrumbs current="Error" links={[
            { title: 'Home', link: '/' },
            { title: 'All boards', link: '/boards' }
          ]} />
          <Errorer message="Unable to display threads" />
        </Fragment>
      )}
    </Section>
  ) : (
    <Loader color="#64707d" />
  )
}

export default Board;

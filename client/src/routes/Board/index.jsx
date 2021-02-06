import { Fragment } from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

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
    }
    getBoard(id: $boardId) {
      title
    }
  }
`;

const Board = ({ match }) => {
  const { boardId } = match.params
  const { loading, data } = useQuery(THREADS_QUERY, {
    variables: {
      boardId
    }
  })

  return !loading ? (
    <Section>
      {data ? (
        <Fragment>
          <Breadcrumbs current={data.getBoard.title} links={[
            { title: 'Home', link: '/' },
            { title: 'All boards', link: '/boards' }
          ]} />

          <SortNav links={[
            { title: 'Default', active: true },
            { title: 'Popular', active: false },
            { title: 'Recently active', active: false },
            { title: 'By messages count', active: false }
          ]} />

          {data.getThreads.map(item => (
            <Card key={item.id} data={item} />
          ))}
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

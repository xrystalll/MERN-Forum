import { Fragment } from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

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
      answersCount
    }
  }
`;

const Boards = () => {
  document.title = 'Forum | Boards'
  const { loading, data } = useQuery(BOARDS_QUERY)

  return !loading ? (
    <Section>
      {data ? (
        <Fragment>
          <Breadcrumbs current="All boards" links={[
            { title: 'Home', link: '/' }
          ]} />

          <SortNav links={[
            { title: 'Default', active: true },
            { title: 'Popular', active: false },
            { title: 'Recently active', active: false },
            { title: 'By answers count', active: false }
          ]} />

          {data.getBoards.sort((a, b) => a.position - b.position).map(item => (
            <BoardCard key={item.id} data={item} />
          ))}
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

import { Fragment } from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import { Section, SectionHeader } from 'components/Section';
import { Card } from 'components/Card';
import { PopularBoardsContainer, PopularBoardsItem } from 'components/PopularBoards';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const BOARDS_AND_RECENTLY_THREADS_QUERY = gql`
  {
    getBoards {
      id
      title
      position
    }
    getRecentlyThreads {
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
  }
`;

const Home = () => {
  document.title = 'Forum'
  const { loading, data } = useQuery(BOARDS_AND_RECENTLY_THREADS_QUERY)

  return !loading ? (
    data ? (
      <Fragment>
        <Section>
          <SectionHeader title="Popular boards" link={{ title: 'All', url: '/boards' }} />

          <PopularBoardsContainer>
            {data.getBoards.map(item => (
              <PopularBoardsItem key={item.id} data={item} />
            ))}
          </PopularBoardsContainer>
        </Section>

        <Section>
          <SectionHeader title="Recently threads" />

          {data.getRecentlyThreads.map(item => (
            <Card key={item.id} data={item} />
          ))}
        </Section>

        <Section>
          <SectionHeader title="Files/Uploads" link={{ title: 'All', url: '/uploads' }} />

        </Section>
      </Fragment>
    ) : (
      <Section>
        <Errorer message="Unable to display content" />
      </Section>
    )
  ) : (
    <Loader color="#64707d" />
  )
};

export default Home;

import { Fragment, useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';

import { StoreContext } from 'store/Store';

import { Section, SectionHeader } from 'components/Section';
import { Card } from 'components/Card';
import { PopularBoardsContainer, PopularBoardsItem } from 'components/PopularBoards';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

import { BOARDS_AND_RECENTLY_THREADS_QUERY } from 'support/Queries';

const Home = () => {
  document.title = 'Forum'
  const { setPostType } = useContext(StoreContext)
  const [init, setInit] = useState(true)

  useEffect(() => {
    init && setPostType({
      type: 'thread',
      id: null
    })
    setInit(false)
  }, [setInit, init, setPostType])

  const { loading, data } = useQuery(BOARDS_AND_RECENTLY_THREADS_QUERY, {
    variables: { limit: 5 }
  })

  return !loading ? (
    data ? (
      <Fragment>
        <Section>
          <SectionHeader title="Popular boards" link={{ title: 'All', url: '/boards' }} />

          <PopularBoardsContainer>
            {data.getBoards.slice().sort((a, b) => b.threadsCount - a.threadsCount).slice(0, 6).map(item => (
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

import { Fragment, useContext, useEffect, useState } from 'react';

import { StoreContext } from 'store/Store';

import { Section, SectionHeader } from 'components/Section';
import { Card } from 'components/Card';
import { PopularBoardsContainer, PopularBoardsItem } from 'components/PopularBoards';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const Home = () => {
  document.title = 'Forum'
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

  const [boards] = useState([])
  const [threads] = useState([])
  const [uploads] = useState([])
  const loading = false

  return !loading ? (
    <Fragment>
      {boards.length ? (
        <Section>
          <SectionHeader title="Popular boards" link={{ title: 'All', url: '/boards' }} />

          <PopularBoardsContainer>
            {boards.slice().sort((a, b) => b.threadsCount - a.threadsCount).slice(0, 6).map(item => (
              <PopularBoardsItem key={item.id} data={item} />
            ))}
          </PopularBoardsContainer>
        </Section>
      ) : null}

      <Section>
        <SectionHeader title="Recently threads" />

        {threads.length ? (
          threads.map(item => (
            <Card key={item.id} data={item} />
          ))
        ) : (
          <Errorer message="No threads yet" />
        )}
      </Section>

      <Section>
        <SectionHeader title="Files/Uploads" link={{ title: 'All', url: '/uploads' }} />

        {uploads.length ? (
          uploads.map(item => (
            <div key={item.id}>{item.title}</div>
          ))
        ) : (
          <Errorer message="No uploads yet" />
        )}
      </Section>
    </Fragment>
  ) : (
    <Loader color="#64707d" />
  )
};

export default Home;

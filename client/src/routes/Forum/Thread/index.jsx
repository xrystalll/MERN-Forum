import { Fragment, useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';

import { StoreContext } from 'store/Store';

import { Section } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import { Card } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

import { THREAD_QUERY, ANSWERS_QUERY } from 'support/Queries';

import Answers from './Answers';

const Thread = ({ match }) => {
  document.title = 'Forum | Thread'
  const { setPostType } = useContext(StoreContext)
  const [init, setInit] = useState(true)
  const { threadId } = match.params

  useEffect(() => {
    init && setPostType({
      type: 'answer',
      id: threadId
    })
    setInit(false)
  }, [setInit, init, setPostType, threadId])

  const { loading: loadingThread, data: threadData } = useQuery(THREAD_QUERY, {
    variables: { id: threadId }
  })

  const { loading: loadingAnswers, data: answersData, subscribeToMore } = useQuery(ANSWERS_QUERY, {
    variables: { id: threadId }
  })

  return !loadingThread ? (
    <Section>
      {threadData ? (
        threadData.getThread ? (
          <Fragment>
            <Breadcrumbs current={threadData.getThread.title} links={[
              { title: 'Home', link: '/' },
              { title: 'All boards', link: '/boards' },
              { title: threadData.getThread.boardTitle, link: '/boards/' + threadData.getThread.boardId }
            ]} />

            <Card data={threadData.getThread} full type="thread" />

            <br />

            {!loadingAnswers ? (
              <Answers
                answers={answersData.getAnswers}
                thread={threadData.getThread}
                subscribeToMore={subscribeToMore}
              />
            ) : (
              <Loader color="#64707d" />
            )}
          </Fragment>
        ) : (
          <Fragment>
            <Breadcrumbs current="Error" links={[
              { title: 'Home', link: '/' },
              { title: 'All boards', link: '/boards' }
            ]} />
            <Errorer message="Thread not found" />
          </Fragment>
        )
      ) : (
        <Fragment>
          <Breadcrumbs current="Error" links={[
            { title: 'Home', link: '/' },
            { title: 'All boards', link: '/boards' }
          ]} />
          <Errorer message="Unable to display thread" />
        </Fragment>
      )}
    </Section>
  ) : (
    <Loader color="#64707d" />
  )
}

export default Thread;

import { Fragment, useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';

import { StoreContext } from 'store/Store';

import { Section } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import { Card } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

import { THREAD_ANSWERS_QUERY } from 'support/Queries';

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

  const { loading, data } = useQuery(THREAD_ANSWERS_QUERY, {
    variables: {
      id: threadId
    }
  })

  return !loading ? (
    <Section>
      {data ? (
        data.getThread ? (
          <Fragment>
            <Breadcrumbs current={data.getThread.title} links={[
              { title: 'Home', link: '/' },
              { title: 'All boards', link: '/boards' },
              { title: data.getThread.boardTitle, link: '/boards/' + data.getThread.boardId }
            ]} />

            <Card data={data.getThread} full type="thread" />

            <br />

            {data.getAnswers.map(item => (
              <Card key={item.id} data={item} threadData={data.getThread} full type="answer" />
            ))}
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

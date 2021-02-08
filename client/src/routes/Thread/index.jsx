import { Fragment, useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import { StoreContext } from 'store/Store';

import { Section } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import { Card } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const THREAD_ANSWERS_QUERY = gql`
  query($id: ID!) {
    getThread(id: $id) {
      id
      boardTitle
      boardId
      pined
      closed
      title
      body
      createdAt
      author {
        id
        username
      }
      edited {
        createdAt
      }
      likes {
        username
      }
      likeCount
      attach {
        file
        type
      }
      answersCount
    }
    getAnswers(threadId: $id) {
      id
      body
      createdAt
      author {
        id
        username
      }
      edited {
        createdAt
      }
      likes {
        username
      }
      likeCount
      attach {
        file
        type
      }
    }
  }
`;

const Thread = ({ match }) => {
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
        <Fragment>
          <Breadcrumbs current={data.getThread.title} links={[
            { title: 'Home', link: '/' },
            { title: 'All boards', link: '/boards' },
            { title: data.getThread.boardTitle, link: '/boards/' + data.getThread.boardId }
          ]} />

          <Card data={data.getThread} full={true} type="thread" />

          <br />

          {data.getAnswers.slice().reverse().map(item => (
            <Card key={item.id} data={item} full={true} type="answer" />
          ))}
        </Fragment>
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

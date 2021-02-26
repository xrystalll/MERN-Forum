import { Fragment, useContext, useEffect, useState } from 'react';

import { StoreContext } from 'store/Store';

import { Section } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import { Card } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

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

  const [board] = useState({})
  const [thread] = useState({})
  const [answers] = useState([])
  const loading = false
  const loadingAnswers = false

  return !loading ? (
    <Section>
      {thread ? (
        <Fragment>
          <Breadcrumbs current={thread.title} links={[
            { title: 'Home', link: '/' },
            { title: 'All boards', link: '/boards' },
            { title: board.boardTitle, link: '/boards/' + thread.boardId }
          ]} />

          <Card data={thread} full type="thread" />

          <br />

          {!loadingAnswers ? (
            <Answers
              answers={answers}
              thread={thread}
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
      )}
    </Section>
  ) : (
    <Loader color="#64707d" />
  )
}

export default Thread;

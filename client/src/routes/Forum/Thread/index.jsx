import { Fragment, useContext, useEffect, useState } from 'react';

import { StoreContext } from 'store/Store';

import { BACKEND } from 'support/Constants';

import { Section } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import { Card } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

import Answers from './Answers';

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
  }, [init])

  const [fetchInit, setFetchInit] = useState(true)
  const [board, setBoard] = useState({})
  const [thread, setThread] = useState({})
  const [loading, setLoading] = useState(true)
  const [noData, setNoData] = useState(false)
  const [answers, setAnswers] = useState([])

  useEffect(() => {
    const threadTitle = thread.title || 'Thread'
    document.title = 'Forum | ' + threadTitle
    const fetchThread = async () => {
      try {
        const data = await fetch(`${BACKEND}/api/thread?threadId=${threadId}`)
        const response = await data.json()

        if (!response.error) {
          setFetchInit(false)
          setBoard(response.board)
          setThread(response.thread)
          setLoading(false)
          setNoData(false)
        } else throw Error(response.error.message)
      } catch(err) {
        setFetchInit(false)
        setNoData(true)
        setLoading(false)
      }
    }

    fetchInit && fetchThread()
  }, [fetchInit, thread])

  return (
    <Section>
      {!noData ? (
        !loading ? (
          <Fragment>
            <Breadcrumbs current={thread.title} links={[
              { title: 'Home', link: '/' },
              { title: 'All boards', link: '/boards' },
              { title: board.title, link: '/boards/' + board.name }
            ]} />

            <Card data={thread} full type="thread" />

            <br />

            {answers.length ? (
              <Answers
                answers={answers}
                thread={thread}
              />
            ) : (
              <Loader className="more_loader" color="#64707d" />
            )}
          </Fragment>
        ) : <Loader color="#64707d" />
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
  )
}

export default Thread;

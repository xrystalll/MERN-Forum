import { Fragment, useContext, useEffect, useState } from 'react';

import { StoreContext } from 'store/Store';

import { BACKEND, Strings } from 'support/Constants';
import Socket, { joinToRoom, leaveFromRoom } from 'support/Socket';

import { Section } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import { Card } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

import Answers from './Answers';

const Thread = ({ match }) => {
  const { user, setPostType, setFabVisible, lang } = useContext(StoreContext)
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
  const [answersSubscribed, setAnswersSubscribed] = useState({})

  useEffect(() => {
    const threadTitle = thread.title || Strings.thread[lang]
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
        } else throw Error(response.error?.message || 'Error')
      } catch(err) {
        setFetchInit(false)
        setNoData(true)
        setLoading(false)
      }
    }

    fetchInit && fetchThread()
  }, [fetchInit, thread])

  useEffect(() => {
    if (thread._id) joinToRoom('thread:' + thread._id)
    return () => {
      if (thread._id) leaveFromRoom('thread:' + thread._id)
    }
  }, [thread._id])

  useEffect(() => {
    Socket.on('threadDeleted', (data) => {
      setFabVisible(false)
    })
    Socket.on('threadEdited', (data) => {
      setThread(data)
    })
    Socket.on('threadLiked', (data) => {
      setThread(data)
    })
    Socket.on('answerCreated', (data) => {
      setAnswersSubscribed({ type: 'answerCreated', payload: data })
    })
    Socket.on('answerDeleted', (data) => {
      setAnswersSubscribed({ type: 'answerDeleted', payload: data })
    })
    Socket.on('answerEdited', (data) => {
      setAnswersSubscribed({ type: 'answerEdited', payload: data })
    })
    Socket.on('answerLiked', (data) => {
      setAnswersSubscribed({ type: 'answerLiked', payload: data })
    })
  }, [])

  return (
    <Section>
      {!noData ? (
        !loading ? (
          <Fragment>
            <Breadcrumbs current={thread.title} links={[
              { title: Strings.home[lang], link: '/' },
              { title: Strings.allBoards[lang], link: '/boards' },
              { title: board.title, link: '/boards/' + board.name }
            ]} />

            <Card data={thread} full type="thread" />

            <br />

            <Answers
              lang={lang}
              user={user}
              thread={thread}
              subcribed={answersSubscribed}
              clearSubcribe={setAnswersSubscribed}
            />
          </Fragment>
        ) : <Loader color="#64707d" />
      ) : (
        <Fragment>
          <Breadcrumbs current={Strings.error[lang]} links={[
            { title: Strings.home[lang], link: '/' },
            { title: Strings.allBoards[lang], link: '/boards' }
          ]} />

          <Errorer message={Strings.threadNotFound[lang]} />
        </Fragment>
      )}
    </Section>
  )
}

export default Thread;

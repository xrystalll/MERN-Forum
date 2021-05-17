import { useContext, useEffect, useState } from 'react';

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
  const { user, token, setPostType, setFabVisible, lang } = useContext(StoreContext)
  const { threadId } = match.params

  useEffect(() => {
    setPostType({
      type: 'answer',
      id: threadId
    })
    // eslint-disable-next-line
  }, [threadId])

  const [board, setBoard] = useState({})
  const [thread, setThread] = useState({})
  const [joined, setJoined] = useState([])
  const [loading, setLoading] = useState(true)
  const [noData, setNoData] = useState(false)
  const [answersSubscribed, setAnswersSubscribed] = useState({})

  useEffect(() => {
    const threadTitle = thread.title || Strings.thread[lang]
    document.title = 'Forum | ' + threadTitle
  }, [thread, lang])

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const data = await fetch(`${BACKEND}/api/thread?threadId=${threadId}`)
        const response = await data.json()

        if (!response.error) {
          setBoard(response.board)
          setThread(response.thread)
          setLoading(false)
          setNoData(false)
        } else throw Error(response.error?.message || 'Error')
      } catch(err) {
        setNoData(true)
        setLoading(false)
      }
    }

    fetchThread()
  }, [threadId])

  useEffect(() => {
    if (thread._id) joinToRoom('thread:' + thread._id, { token })
    return () => {
      if (thread._id) leaveFromRoom('thread:' + thread._id)
    }
  }, [thread._id, token])

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
    Socket.on('joinedList', (data) => {
      setJoined(data)
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
    Socket.on('threadCleared', (data) => {
      setAnswersSubscribed({ type: 'threadCleared', payload: data })
    })
    // eslint-disable-next-line
  }, [])

  return (
    <Section>
      {!noData ? (
        !loading ? (
          <>
            <Breadcrumbs current={thread.title} links={[
              { title: Strings.home[lang], link: '/' },
              { title: Strings.allBoards[lang], link: '/boards' },
              { title: board.title, link: '/boards/' + board.name }
            ]} />

            <Card data={thread} full type="thread" joinedList={joined} />

            <br />

            <Answers
              lang={lang}
              user={user}
              thread={thread}
              subcribed={answersSubscribed}
              clearSubcribe={setAnswersSubscribed}
            />
          </>
        ) : <Loader color="#64707d" />
      ) : (
        <>
          <Breadcrumbs current={Strings.error[lang]} links={[
            { title: Strings.home[lang], link: '/' },
            { title: Strings.allBoards[lang], link: '/boards' }
          ]} />

          <Errorer message={Strings.threadNotFound[lang]} />
        </>
      )}
    </Section>
  )
}

export default Thread;

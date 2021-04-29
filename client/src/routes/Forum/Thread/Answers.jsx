import { useEffect, useState } from 'react';

import { BACKEND, Strings } from 'support/Constants';

import { Card } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const Answers = ({ lang, user, thread, subcribed, clearSubcribe }) => {
  const [answers, setAnswers] = useState([])
  const pagination = false
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const data = await fetch(`${BACKEND}/api/answers?threadId=${thread._id}&pagination=${pagination}`)
        const response = await data.json()

        if (!response.error) {
          setAnswers(response.docs)
          setLoading(false)
        } else throw Error(response.error?.message || 'Error')
      } catch(err) {
        setLoading(false)
      }
    }

    fetchAnswers()
    // eslint-disable-next-line
  }, [thread._id])

  useEffect(() => {
    if (!subcribed.type) return

    if (subcribed.type === 'answerCreated') {
      setAnswers(prev => [...prev, subcribed.payload])
      if (user && user.id === subcribed.payload.author._id) {
        window.scrollTo(0, document.body.scrollHeight)
      }
    }
    if (subcribed.type === 'answerDeleted') {
      setAnswers(prev => prev.filter(item => item._id !== subcribed.payload.id))
    }
    if (subcribed.type === 'answerEdited' || subcribed.type === 'answerLiked') {
      let newArray = [...answers]
      newArray[newArray.findIndex(item => item._id === subcribed.payload._id)] = subcribed.payload

      setAnswers(newArray)
    }
    if (subcribed.type === 'threadCleared') {
      setAnswers([])
    }

    clearSubcribe({})
  }, [answers, subcribed, user, clearSubcribe])

  return !loading ? (
    answers.length ? (
      answers.map(item => (
        <Card key={item._id} data={item} threadData={thread} full type="answer" />
      ))
    ) : <Errorer message={Strings.noAnswersYet[lang]} />
  ) : <Loader className="more_loader" color="#64707d" />
}

export default Answers;

import { useEffect, useState } from 'react';

import { BACKEND } from 'support/Constants';

import { Card } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const Answers = ({ thread }) => {
  const [init, setInit] = useState(true)
  const [answers, setAnswers] = useState([])
  const pagination = false
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const data = await fetch(`${BACKEND}/api/answers?threadId=${thread._id}&pagination=${pagination}`)
        const response = await data.json()

        if (!response.error) {
          setInit(false)
          setAnswers(response.docs)
          setLoading(false)
        } else throw Error(response.error.message)
      } catch(err) {
        setInit(false)
        setLoading(false)
      }
    }

    init && fetchAnswers()
  }, [init])

  return !loading ? (
    answers.length ? (
      answers.map(item => (
        <Card key={item._id} data={item} threadData={thread} full type="answer" />
      ))
    ) : <Errorer message="No answers yet" />
  ) : <Loader className="more_loader" color="#64707d" />
}

export default Answers;

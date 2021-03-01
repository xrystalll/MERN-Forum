import { useEffect, useState } from 'react';

import { BACKEND } from 'support/Constants';

import { Section, SectionHeader } from 'components/Section';
import { Card } from 'components/Card';
import Errorer from 'components/Errorer';

const Threads = () => {
  const [init, setInit] = useState(true)
  const [threads, setThreads] = useState([])
  const limit = 5

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const data = await fetch(`${BACKEND}/api/threads/recently?limit=${limit}`)
        const response = await data.json()

        if (!response.error) {
          setInit(false)
          setThreads(response.docs)
        } else throw Error(response.error.message)
      } catch(err) {
        console.error(err)
      }
    }

    init && fetchThreads()
  }, [init])

  return (
    <Section>
      <SectionHeader title="Recently threads" />

      {threads.length ? (
        threads.map(item => (
          <Card key={item._id} data={item} />
        ))
      ) : (
        <Errorer message="No threads yet" />
      )}
    </Section>
  )
}

export default Threads;

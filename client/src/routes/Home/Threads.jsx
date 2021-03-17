import { useEffect, useState } from 'react';

import { BACKEND, Strings } from 'support/Constants';

import { Section, SectionHeader } from 'components/Section';
import { Card } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const Threads = ({ lang }) => {
  const [init, setInit] = useState(true)
  const [threads, setThreads] = useState([])
  const limit = 5
  const [noData, setNoData] = useState(false)

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const data = await fetch(`${BACKEND}/api/threads/recently?limit=${limit}`)
        const response = await data.json()

        if (!response.error) {
          if (response.docs.length) {
            setInit(false)
            setThreads(response.docs)
          } else {
            setNoData(true)
          }
        } else throw Error(response.error?.message || 'Error')
      } catch(err) {
        console.error(err)
        setNoData(true)
      }
    }

    init && fetchThreads()
  }, [init])

  return (
    <Section>
      <SectionHeader title={Strings.recentlyThreads[lang]} />

      {!noData ? (
        threads.length ? (
          threads.map(item => (
            <Card key={item._id} data={item} />
          ))
        ) : <Loader color="#64707d" />
      ) : (
        <Errorer message={Strings.noThreadsYet[lang]} />
      )}
    </Section>
  )
}

export default Threads;

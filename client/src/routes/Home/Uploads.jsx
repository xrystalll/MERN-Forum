import { useEffect, useState } from 'react';

import { BACKEND } from 'support/Constants';

import { Section, SectionHeader } from 'components/Section';
import Errorer from 'components/Errorer';

const Uploads = () => {
  const [init, setInit] = useState(true)
  const [uploads, setUploads] = useState([])
  const limit = 3

  useEffect(() => {
    const fetchUploads = async () => {
      return
      // try {
      //   const data = await fetch(`${BACKEND}/api/uploads?limit=${limit}`)
      //   const response = await data.json()

      //   if (!response.error) {
      //     setInit(false)
      //     setUploads(response.docs)
      //   } else throw Error(response.error?.message || 'Error')
      // } catch(err) {
      //   console.error(err)
      // }
    }

    init && fetchUploads()
  }, [init])

  return (
    <Section>
      <SectionHeader title="Files/Uploads" link={{ title: 'All', url: '/uploads' }} />

      {uploads.length ? (
        uploads.map(item => (
          <div key={item._id}>{item.title}</div>
        ))
      ) : (
        <Errorer message="No uploads yet" />
      )}
    </Section>
  )
}

export default Uploads;

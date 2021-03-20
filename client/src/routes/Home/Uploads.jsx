import { useEffect, useState } from 'react';

import { BACKEND, Strings } from 'support/Constants';

import { Section, SectionHeader } from 'components/Section';
import { FileCard } from 'components/Card';
import Errorer from 'components/Errorer';

const Uploads = ({ lang }) => {
  const [init, setInit] = useState(true)
  const [uploads, setUploads] = useState([])
  const limit = 3
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const data = await fetch(`${BACKEND}/api/files/all?limit=${limit}&sort=moderated`)
        const response = await data.json()

        if (!response.error) {
          setInit(false)
          setUploads(response.docs)
          setLoading(false)
        } else throw Error(response.error?.message || 'Error')
      } catch(err) {
        console.error(err)
        setLoading(false)
      }
    }

    init && fetchUploads()
  }, [init])

  return !loading && (
    <Section>
      <SectionHeader
        title={Strings.filesUploads[lang]}
        link={{ title: Strings.all[lang], url: '/uploads' }}
      />

      {uploads.length ? (
        uploads.map(item => (
          <FileCard key={item._id} data={item}/>
        ))
      ) : (
        <Errorer message={Strings.noUploadsYet[lang]} />
      )}
    </Section>
  )
}

export default Uploads;

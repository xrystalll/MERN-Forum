import { useContext, useEffect, useState } from 'react';

import { StoreContext } from 'store/Store';

import { BACKEND, Strings } from 'support/Constants';

import { Section } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

import Items from './Items';

const Folder = ({ match }) => {
  const { setPostType, setFabVisible, lang } = useContext(StoreContext)
  const { folderName } = match.params
  const [init, setInit] = useState(true)
  const [folder, setFolder] = useState({})
  const [loading, setLoading] = useState(true)
  const [noData, setNoData] = useState(false)

  useEffect(() => {
    setFabVisible(true)
    setPostType({
      type: 'upload',
      id: folder._id || null
    })
    // eslint-disable-next-line
  }, [folder])

  useEffect(() => {
    const folderFullName = folder.title || Strings.folder[lang]
    document.title = 'Forum | ' + folderFullName
    const fetchFolder = async () => {
      try {
        const data = await fetch(`${BACKEND}/api/folder?name=${folderName}`)
        const response = await data.json()

        if (!response.error) {
          setInit(false)
          setFolder(response)
          setLoading(false)
          setNoData(false)
        } else throw Error(response.error?.message || 'Error')
      } catch(err) {
        setInit(false)
        setNoData(true)
        setLoading(false)
      }
    }

    init && fetchFolder()
  }, [init, folder, folderName, lang])

  return (
    <Section>
      <Breadcrumbs current={folder.title || folderName} links={[
        { title: Strings.home[lang], link: '/' },
        { title: Strings.uploadsFolders[lang], link: '/uploads' }
      ]} />

      {!noData ? (
        !loading
          ? <Items folderId={folder._id} lang={lang} />
          : <Loader color="#64707d" />
      ) : (
        <Errorer message={Strings.unableToDisplayFolder[lang]} />
      )}
    </Section>
  )
}

export default Folder;

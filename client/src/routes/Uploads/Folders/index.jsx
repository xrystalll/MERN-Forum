import { useContext, useEffect, useState } from 'react';

import { StoreContext } from 'store/Store';

import { Strings } from 'support/Constants';

import { Section } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';

import Items from './Items';

const Folders = () => {
  const { setPostType, setFabVisible, lang } = useContext(StoreContext)
  document.title = 'Forum | ' + Strings.filesUploads[lang]
  const [init, setInit] = useState(true)

  useEffect(() => {
    if (init) {
      setFabVisible(true)
      setPostType({
        type: 'upload',
        id: null
      })
    }
    setInit(false)
    // eslint-disable-next-line
  }, [init])

  return (
    <Section>
      <Breadcrumbs current={Strings.uploadsFolders[lang]} links={[
        { title: Strings.home[lang], link: '/' }
      ]} />

      <Items lang={lang} />
    </Section>
  )
}

export default Folders;

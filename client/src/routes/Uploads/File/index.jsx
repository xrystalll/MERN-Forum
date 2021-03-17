import { Fragment, useContext, useEffect, useState } from 'react';

import { StoreContext } from 'store/Store';

import { BACKEND, Strings } from 'support/Constants';

import { Section } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import { Card } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const File = ({ match }) => {
  const { user, setPostType, lang } = useContext(StoreContext)
  const [init, setInit] = useState(true)
  const { fileId } = match.params

  return (
    <Section>
      <Breadcrumbs current={fileId} links={[
        { title: Strings.home[lang], link: '/' },
        { title: Strings.uploadsFolders[lang], link: '/uploads' },
        { title: 'Images', link: '/uploads/' + 'images' }
      ]} />

      <div>File {fileId}</div>
    </Section>
  )
}

export default File;

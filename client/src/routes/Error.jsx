import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { StoreContext } from 'store/Store';

import { Strings } from 'support/Constants';

import { Section, SectionHeader } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';

const NotFound = () => {
  const { lang } = useContext(StoreContext)
  document.title = 'Forum | ' + Strings.error404PageNotFound[lang]

  return (
    <Section>
      <Breadcrumbs current={Strings.notFound[lang]} links={[
        { title: Strings.home[lang], link: '/' }
      ]} />

      <SectionHeader title={Strings.error404PageNotFound[lang]} />

      <Link to="/">{Strings.goToHomePage[lang]}</Link>
    </Section>
  )
}

export { NotFound };

import { useContext } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import { StoreContext } from 'store/Store';

import { Strings } from 'support/Constants';

import { Section } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import Errorer from 'components/Errorer';

import Results from './Results';

const Search = () => {
  const { lang } = useContext(StoreContext)
  const { path } = useRouteMatch()

  return (
    <Section>
      <Breadcrumbs current={Strings.search[lang]} links={[
        { title: Strings.home[lang], link: '/' }
      ]} />

      <Switch>
        <Route path={path + '/:searchQuery'}>
          <Results lang={lang} />
        </Route>
        <Route path={path} exact>
          <Errorer message={Strings.enterYourSearchTerm[lang]} />
        </Route>
      </Switch>
    </Section>
  )
}

export default Search;

import { useContext, useState } from 'react';
import { Switch, Redirect, Route, useRouteMatch } from 'react-router-dom';

import { StoreContext } from 'store/Store';

import { Strings } from 'support/Constants';

import { Section } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import SortNav from 'components/SortNav';
import Errorer from 'components/Errorer';

import Results from './Results';

const Search = () => {
  const { lang } = useContext(StoreContext)
  const { path } = useRouteMatch()
  const [type, setType] = useState('threads')

  return (
    <Section>
      <Breadcrumbs current={Strings.search[lang]} links={[
        { title: Strings.home[lang], link: '/' }
      ]} />

      <SortNav links={[
        { title: Strings.threads[lang], sort: 'threads' },
        { title: Strings.answers[lang], sort: 'answers' },
        { title: Strings.boards[lang], sort: 'boards' },
        { title: Strings.users[lang], sort: 'users' }
      ]} setSort={setType} state={type} />

      <Switch>
        <Route path={path + '/:searchQuery'}>
          <Results lang={lang} type={type} />
        </Route>
        <Route path={path} exact>
          <Errorer message={Strings.enterYourSearchTerm[lang]} />
        </Route>
        <Route>
          <Redirect to={path} />
        </Route>
      </Switch>
    </Section>
  )
}

export default Search;

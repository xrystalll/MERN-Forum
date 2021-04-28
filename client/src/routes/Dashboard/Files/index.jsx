import { useContext, useEffect, useState } from 'react';
import { Switch, Redirect, Route, useRouteMatch } from 'react-router-dom';

import { StoreContext } from 'store/Store';

import { Strings } from 'support/Constants';

import Breadcrumbs from 'components/Breadcrumbs';
import SortNav from 'components/SortNav';

import NotModerated from './NotModerated';
import All from './All';

const Files = ({ history, location: { pathname } }) => {
  const { lang } = useContext(StoreContext)
  document.title = 'Forum | ' + Strings.moderateFiles[lang]
  const { path } = useRouteMatch()
  const [sort, setSort] = useState(pathname.substr(pathname.lastIndexOf('/') + 1) || 'files')

  useEffect(() => {
    let route
    if (sort === 'all') {
      route = path + '/all'
    } else {
      route = path
    }

    history.push(route)
  }, [sort, path, history])

  return (
    <>
      <Breadcrumbs current={Strings.moderateFiles[lang]} links={[
        { title: Strings.home[lang], link: '/' },
        { title: Strings.dashboard[lang], link: '/dashboard' }
      ]} />

      <SortNav links={[
        { title: Strings.needToModerate[lang], sort: 'files' },
        { title: Strings.all[lang], sort: 'all' }
      ]} setSort={setSort} state={sort} />

      <Switch>
        <Route path={path + '/all'} component={All} />
        <Route path={path} exact component={NotModerated} />
        <Route>
          <Redirect to={path} />
        </Route>
      </Switch>
    </>
  )
}

export default Files;

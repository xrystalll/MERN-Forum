import { useContext, useEffect, useState } from 'react';
import { Switch, Redirect, Route, useRouteMatch } from 'react-router-dom';

import { StoreContext } from 'store/Store';

import { Strings } from 'support/Constants';

import Breadcrumbs from 'components/Breadcrumbs';
import SortNav from 'components/SortNav';

import Newest from './Newest';
import All from './All';

const Bans = ({ history, location: { pathname } }) => {
  const { lang } = useContext(StoreContext)
  document.title = 'Forum | ' + Strings.bans[lang]
  const { path } = useRouteMatch()
  const [sort, setSort] = useState(pathname.substr(pathname.lastIndexOf('/') + 1) || 'bans')

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
      <Breadcrumbs current={Strings.bans[lang]} links={[
        { title: Strings.home[lang], link: '/' },
        { title: Strings.dashboard[lang], link: '/dashboard' }
      ]} />

      <SortNav links={[
        { title: Strings.byNewest[lang], sort: 'bans' },
        { title: Strings.all[lang], sort: 'all' }
      ]} setSort={setSort} state={sort} />

      <Switch>
        <Route path={path + '/all'} component={All} />
        <Route path={path} exact component={Newest} />
        <Route>
          <Redirect to={path} />
        </Route>
      </Switch>
    </>
  )
}

export default Bans;

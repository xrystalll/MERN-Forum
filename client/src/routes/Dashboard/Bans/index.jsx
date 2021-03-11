import { Fragment, useContext, useEffect, useState } from 'react';
import { Switch, Redirect, Route, useRouteMatch } from 'react-router-dom';

import { StoreContext } from 'store/Store';

import { Strings } from 'support/Constants';

import Breadcrumbs from 'components/Breadcrumbs';
import SortNav from 'components/SortNav';

import Newest from './Newest';
import Old from './Old';

const Bans = ({ history, location: { pathname } }) => {
  const { token, lang } = useContext(StoreContext)
  document.title = 'Forum | ' + Strings.bans[lang]
  const { path } = useRouteMatch()
  const [sort, setSort] = useState(pathname.substr(pathname.lastIndexOf('/') + 1) || 'bans')

  useEffect(() => {
    let route
    if (sort === 'oldest') {
      route = path + '/oldest'
    } else {
      route = path
    }

    history.push(route)
  }, [sort])

  return (
    <Fragment>
      <Breadcrumbs current={Strings.bans[lang]} links={[
        { title: Strings.home[lang], link: '/' },
        { title: Strings.dashboard[lang], link: '/dashboard' }
      ]} />

      <SortNav links={[
        { title: Strings.newest[lang], sort: 'bans' },
        { title: Strings.oldest[lang], sort: 'oldest' }
      ]} setSort={setSort} state={sort} />

      <Switch>
        <Route path={path + '/oldest'} component={Old} />
        <Route path={path} exact component={Newest} />
        <Route>
          <Redirect to={path} />
        </Route>
      </Switch>
    </Fragment>
  )
}

export default Bans;

import { useContext, useEffect, useState } from 'react';
import { Switch, Redirect, Route, useRouteMatch } from 'react-router-dom';

import { StoreContext } from 'store/Store';

import { Section } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import SortNav from 'components/SortNav';

import Newest from './Newest';
import Old from './Old';

const Bans = ({ history, location: { pathname } }) => {
  document.title = 'Forum | Bans'
  const { token } = useContext(StoreContext)
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
    <Section>
      <Breadcrumbs current="Bans" links={[
        { title: 'Home', link: '/' },
        { title: 'Dashboard', link: '/dashboard' }
      ]} />

      <SortNav links={[
        { title: 'Newest', sort: 'bans' },
        { title: 'Oldest', sort: 'oldest' }
      ]} setSort={setSort} state={sort} />

      <Switch>
        <Route path={path + '/oldest'} component={Old} />
        <Route path={path} exact component={Newest} />
        <Route>
          <Redirect to={path} />
        </Route>
      </Switch>
    </Section>
  )
}

export default Bans;

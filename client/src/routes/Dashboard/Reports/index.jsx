import { useContext, useEffect, useState } from 'react';
import { Switch, Redirect, Route, useRouteMatch } from 'react-router-dom';

import { StoreContext } from 'store/Store';

import { Strings } from 'support/Constants';

import Breadcrumbs from 'components/Breadcrumbs';
import SortNav from 'components/SortNav';

import Unread from './Unread';
import Read from './Read';

const Reports = ({ history, location: { pathname } }) => {
  const { lang } = useContext(StoreContext)
  document.title = 'Forum | ' + Strings.reports[lang]
  const { path } = useRouteMatch()
  const [sort, setSort] = useState(pathname.substr(pathname.lastIndexOf('/') + 1) || 'reports')

  useEffect(() => {
    let route
    if (sort === 'read') {
      route = path + '/read'
    } else {
      route = path
    }

    history.push(route)
  }, [sort, path, history])

  useEffect(() => {
    localStorage.removeItem('reports')
  }, [])

  return (
    <>
      <Breadcrumbs current={Strings.reports[lang]} links={[
        { title: Strings.home[lang], link: '/' },
        { title: Strings.dashboard[lang], link: '/dashboard' }
      ]} />

      <SortNav links={[
        { title: Strings.unread[lang], sort: 'reports' },
        { title: Strings.read[lang], sort: 'read' }
      ]} setSort={setSort} state={sort} />

      <Switch>
        <Route path={path + '/read'} component={Read} />
        <Route path={path} exact component={Unread} />
        <Route>
          <Redirect to={path} />
        </Route>
      </Switch>
    </>
  )
}

export default Reports;

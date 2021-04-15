import { useContext, useEffect, useState } from 'react';
import { Switch, Redirect, Route, useRouteMatch } from 'react-router-dom';

import { StoreContext } from 'store/Store';

import { Strings } from 'support/Constants';

import { Section } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import SortNav from 'components/SortNav';

import Newest from './Newest';
import Old from './Old';
import Online from './Online';
import Karma from './Karma';

const Users = ({ history, location: { pathname } }) => {
  const { user, setPostType, setFabVisible, lang } = useContext(StoreContext)
  document.title = 'Forum | ' + Strings.users[lang]
  const { path } = useRouteMatch()
  const [init, setInit] = useState(true)
  const [sort, setSort] = useState(pathname.substr(pathname.lastIndexOf('/') + 1) || 'users')

  useEffect(() => {
    if (init) {
      setFabVisible(true)
      setPostType({
        type: 'thread',
        id: null
      })
    }
    setInit(false)
    // eslint-disable-next-line
  }, [init])

  useEffect(() => {
    let route
    if (sort === 'oldest') {
      route = path + '/oldest'
    } else if (sort === 'online') {
      route = path + '/online'
    } else if (sort === 'karma') {
      route = path + '/karma'
    } else {
      route = path
    }

    history.push(route)
  }, [sort, path, history])

  const sortItems = [
    { title: Strings.newest[lang], sort: 'users' },
    { title: Strings.oldest[lang], sort: 'oldest' },
    { title: Strings.online[lang], sort: 'online' }
  ]
  if (user) {
    sortItems.push({ title: Strings.karma[lang], sort: 'karma' })
  }

  return (
    <Section>
      <Breadcrumbs current={Strings.users[lang]} links={[
        { title: Strings.home[lang], link: '/' }
      ]} />

      <SortNav links={sortItems} setSort={setSort} state={sort} />

      <Switch>
        <Route path={path + '/oldest'} exact>
          <Old lang={lang} />
        </Route>

        <Route path={path + '/online'} exact>
          <Online lang={lang} />
        </Route>

        {user && (
          <Route path={path + '/karma'} exact>
            <Karma lang={lang} />
          </Route>
        )}

        <Route path={path} exact>
          <Newest lang={lang} />
        </Route>

        <Route>
          <Redirect to={path} />
        </Route>
      </Switch>
    </Section>
  )
}

export default Users;

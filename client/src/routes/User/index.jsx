import { useContext, useEffect } from 'react';
import { Switch, Redirect, Route, useRouteMatch } from 'react-router-dom';

import { StoreContext } from 'store/Store';

import { Section } from 'components/Section';

import Profile from './Profile';
import Settings from './Settings';
import './style.css';

const User = ({ match }) => {
  const { userName } = match.params
  const { setFabVisible } = useContext(StoreContext)
  const { path } = useRouteMatch()

  useEffect(() => {
    setFabVisible(false)
    // eslint-disable-next-line
  }, [])

  return (
    <Section>
      <Switch>
        <Route path={path + '/settings'} exact component={Settings} />
        <Route path={path}>
          <Profile userName={userName} />
        </Route>
        <Route>
          <Redirect to={path} />
        </Route>
      </Switch>
    </Section>
  )
}

export default User;

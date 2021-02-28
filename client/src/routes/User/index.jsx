import { useContext, useEffect, useState } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import { StoreContext } from 'store/Store';

import { Section } from 'components/Section';

import Profile from './Profile';
import Settings from './Settings';

const User = ({ match }) => {
  const { userId } = match.params
  const { setFabVisible } = useContext(StoreContext)
  const { path } = useRouteMatch()

  useEffect(() => {
    setFabVisible(false)
  }, [])

  return (
    <Section>
      <Switch>
        <Route path={path + '/settings'} exact component={Settings} />
        <Route path={path} exact>
          <Profile userId={userId} />
        </Route>
      </Switch>
    </Section>
  )
}

export default User;

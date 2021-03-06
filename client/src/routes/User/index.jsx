import { useContext, useEffect, useState } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

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
  }, [])

  return (
    <Section>
      <Switch>
        <Route path={path + '/settings'} exact component={Settings} />
        <Route path={path} exact>
          <Profile userName={userName} />
        </Route>
      </Switch>
    </Section>
  )
}

export default User;

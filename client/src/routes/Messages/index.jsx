import { useContext, useEffect } from 'react';
import { Switch, Redirect, Route, useRouteMatch } from 'react-router-dom';

import { StoreContext } from 'store/Store';

import { Section } from 'components/Section';

import Dialogues from './Dialogues';
import Dialogue from './Dialogue';

const Messages = () => {
  const { setFabVisible } = useContext(StoreContext)
  const { path } = useRouteMatch()

  useEffect(() => {
    setFabVisible(false)
    // eslint-disable-next-line
  }, [])

  return (
    <Section>
      <Switch>
        <Route path={path + '/:userName'} component={Dialogue} />
        <Route path={path} exact component={Dialogues} />
        <Route>
          <Redirect to={path} />
        </Route>
      </Switch>
    </Section>
  )
}

export default Messages;

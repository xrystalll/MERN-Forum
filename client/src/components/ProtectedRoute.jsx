import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { StoreContext } from 'store/Store';

export const AuthRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(StoreContext)

  return (
    <Route
      {...rest}
      render={(props) => (user ? <Redirect to="/" /> : <Component {...props} />)}
    />
  )
}

export const UsersOnlyRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(StoreContext)

  return (
    <Route
      {...rest}
      render={(props) => (user ? <Component {...props} /> : <Redirect to="/" />)}
    />
  )
}

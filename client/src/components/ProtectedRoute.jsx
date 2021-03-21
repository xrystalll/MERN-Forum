import { useContext, useEffect } from 'react';
import { Route, Redirect, useHistory } from 'react-router-dom';

import { StoreContext } from 'store/Store';

export const GeneralRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (localStorage.getItem('ban') ? <Redirect to="/banned" /> : <Component {...props} />)}
    />
  )
}

export const AuthRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(StoreContext)
  const history = useHistory()

  useEffect(() => {
    if (localStorage.getItem('ban')) return history.push('/banned')
  })

  return (
    <Route
      {...rest}
      render={(props) => (user ? <Redirect to="/" /> : <Component {...props} />)}
    />
  )
}

export const UsersOnlyRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(StoreContext)
  const history = useHistory()

  useEffect(() => {
    if (localStorage.getItem('ban')) return history.push('/banned')
  })

  return (
    <Route
      {...rest}
      render={(props) => (user ? <Component {...props} /> : <Redirect to="/signup" />)}
    />
  )
}

export const AdminsOnlyRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(StoreContext)
  const history = useHistory()

  useEffect(() => {
    if (localStorage.getItem('ban')) return history.push('/banned')
  })

  return (
    <Route
      {...rest}
      render={(props) => (user && user.role >= 2 ? <Component {...props} /> : <Redirect to="/" />)}
    />
  )
}

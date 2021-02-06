import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { StoreContext } from 'store/Store';

const AuthRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(StoreContext)

  return (
    <Route
      {...rest}
      render={(props) => (user ? <Redirect to="/" /> : <Component {...props} />)}
    />
  )
};

export default AuthRoute;

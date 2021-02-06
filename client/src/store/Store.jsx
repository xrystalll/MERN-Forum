import { createContext, useReducer } from 'react';
import jwtDecode from 'jwt-decode';

import Reducer from './Reducer';

const initialState = {
  user: null
}

if (localStorage.getItem('token')) {
  const decodedToken = jwtDecode(localStorage.getItem('token'))

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem('token')
  } else {
    initialState.user = decodedToken
  }
}

const StoreContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {}
})

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState)

  const login = (userData) => {
    localStorage.setItem('token', userData.token)
    dispatch({
      type: 'LOGIN',
      payload: userData
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <StoreContext.Provider value={{ user: state.user, login, logout }}>
      {children}
    </StoreContext.Provider>
  )
};

export { StoreContext };
export default Store;

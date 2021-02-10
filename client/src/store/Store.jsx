import { createContext, useReducer, useState } from 'react';
import jwtDecode from 'jwt-decode';

import Reducer from './Reducer';

const initialState = {
  user: null,
  postType: {
    type: 'thread',
    id: null,
    someData: null
  },
  fab: true
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
  postType: {
    type: 'thread',
    id: null,
    someData: null
  },
  fab: true,
  login: (userData) => {},
  logout: () => {}
})

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState)
  const [modalOpen, setModalOpen] = useState(false)

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

  const setPostType = (payload) => {
    dispatch({
      type: 'SET_POST_TYPE',
      payload: payload
    })
  }

  const setFabVisible = (payload) => {
    dispatch({
      type: 'SET_FAB_VISIBLE',
      payload: payload
    })
  }

  return (
    <StoreContext.Provider value={{
      user: state.user,
      modalOpen,
      setModalOpen,
      postType: state.postType,
      setPostType,
      fab: state.fab,
      setFabVisible,
      login,
      logout
    }}>
      {children}
    </StoreContext.Provider>
  )
};

export { StoreContext };
export default Store;

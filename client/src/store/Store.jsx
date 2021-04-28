import { createContext, useReducer, useState } from 'react';
import jwtDecode from 'jwt-decode';

import { language } from 'support/Utils';

import Reducer from './Reducer';

let user = null
let token = null
if (localStorage.getItem('token')) {
  const decodedToken = jwtDecode(localStorage.getItem('token'))

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem('token')
    localStorage.removeItem('userPicture')
  } else {
    user = { ...decodedToken, picture: decodedToken.picture || null}
    token = localStorage.getItem('token')
  }
}

const lang = language()
document.querySelector('html').lang = lang

const initialState = {
  user,
  token,
  postType: {
    type: 'thread',
    id: null,
    someData: null
  },
  fab: true,
  lang
}

export const StoreContext = createContext(initialState)

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState)
  const [modalOpen, setModalOpen] = useState(false)

  const setLang = (payload) => {
    localStorage.setItem('lang', payload)
    document.querySelector('html').lang = payload
    dispatch({
      type: 'SET_LANG',
      payload
    })
  }

  const login = (payload) => {
    localStorage.setItem('token', payload.accessToken)
    localStorage.setItem('userPicture', payload.user?.picture || '')
    dispatch({
      type: 'SET_TOKEN',
      payload: payload.accessToken
    })
    dispatch({
      type: 'LOGIN',
      payload: payload.user
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userPicture')
    dispatch({ type: 'LOGOUT' })
  }

  const setUserPicture = (payload) => {
    localStorage.setItem('userPicture', payload)
    dispatch({
      type: 'SET_USER_PICTURE',
      payload
    })
  }

  const setPostType = (payload) => {
    dispatch({
      type: 'SET_POST_TYPE',
      payload
    })
  }

  const setFabVisible = (payload) => {
    dispatch({
      type: 'SET_FAB_VISIBLE',
      payload
    })
  }

  const store = {
    lang: state.lang,
    setLang,
    token: state.token,
    user: state.user,
    setUserPicture,
    modalOpen,
    setModalOpen,
    postType: state.postType,
    setPostType,
    fab: state.fab,
    setFabVisible,
    login,
    logout
  }

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  )
};

export default Store;

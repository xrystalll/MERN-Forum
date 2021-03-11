import { Fragment, useEffect, useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { StoreContext } from 'store/Store';

import { Strings } from 'support/Constants';

import Dropdown from './Dropdown';
import Notifications from './Notifications';
import './style.css';

const Header = ({ setMenuState }) => {
  const { user, token, lang } = useContext(StoreContext)
  const searchField = useRef()
  const [searchActive, setSearchActive] = useState(false)

  useEffect(() => {
    if (searchActive) {
      searchField.current?.focus()
      document.addEventListener('click', handleClickOutside)
    }
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [searchActive])

  const handleClickOutside = ({ target }) => {
    if (searchField.current?.contains(target)) return

    setSearchActive(false)
  }

  return (
    <header className="app_head">
      <div className="head_inner">
        <div className="head_left">
          <div className="open_nav" onClick={() => setMenuState()}>
            <i className="bx bx-menu" />
          </div>
          <h1 className="app_name">Forum</h1>
        </div>

        <ul className="head_act">
          <li className={searchActive ? 'head_search open' : 'head_search'}>
            <input
              ref={searchField}
              className="head_search_field"
              type="search"
              placeholder={Strings.enterForSearch[lang] + '...'}
            />
            <i className="head_search_ic bx bx-search" onClick={() => setSearchActive(!searchActive)} />
          </li>

          {user ? (
            <Fragment>
              <Notifications />

              <Dropdown />
            </Fragment>
          ) : (
           <Fragment>
              <li className="head_auth">
                <Link to="/signup" className="btn media_hide">
                  <i className="bx bx-user-plus" />
                  <span>{Strings.signUp[lang]}</span>
                </Link>
              </li>

              <li className="head_auth">
                <Link to="/signin" className="btn media_hide hollow">
                  <i className="bx bx-log-in" />
                  <span>{Strings.signIn[lang]}</span>
                </Link>
              </li>
            </Fragment>
          )}
        </ul>
      </div>
    </header>
  )
}

export default Header;

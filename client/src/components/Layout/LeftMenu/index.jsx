import { Fragment, useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { StoreContext } from 'store/Store';

import { Strings } from 'support/Constants';
import { counter } from 'support/Utils';
import './style.css';

const LeftMenu = ({ open, setMenuOpen }) => {
  const { user, lang } = useContext(StoreContext)
  const [messages] = useState(0)
  const menuOpen = open ? 'left_bar open' : 'left_bar'

  return (
    <aside className={menuOpen}>
      <nav className="main_nav">
        <ul className="nav_links">
          {user && (
            <Fragment>
              {user.role === 'admin' && (
                <li className="nav_item">
                  <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>
                    <span className="nav_text">{Strings.dashboard[lang]}</span>
                  </NavLink>
                </li>
              )}
              <li className="nav_item">
                <NavLink to="/messages" onClick={() => setMenuOpen(false)}>
                  <span className="nav_text">{Strings.messages[lang]}</span>
                  {messages > 0 && <span className="nav_counter">{counter(messages)}</span>}
                </NavLink>
              </li>
            </Fragment>
          )}
          <li className="nav_item">
            <NavLink to="/boards" onClick={() => setMenuOpen(false)}>
              <span className="nav_text">{Strings.allBoards[lang]}</span>
            </NavLink>
          </li>
          <li className="nav_item">
            <NavLink to="/uploads" onClick={() => setMenuOpen(false)}>
              <span className="nav_text">{Strings.filesUploads[lang]}</span>
            </NavLink>
          </li>
          <li className="nav_item">
            <NavLink to="/users" onClick={() => setMenuOpen(false)}>
              <span className="nav_text">{Strings.users[lang]}</span>
            </NavLink>
          </li>
          <li className="nav_item">
            <NavLink to="/admin" onClick={() => setMenuOpen(false)}>
              <span className="nav_text">{Strings.admins[lang]}</span>
            </NavLink>
          </li>
          <li className="nav_item">
            <NavLink to="/rules" onClick={() => setMenuOpen(false)}>
              <span className="nav_text">{Strings.rules[lang]}</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default LeftMenu;

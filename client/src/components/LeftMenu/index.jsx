import { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { StoreContext } from 'store/Store';
import { counter } from 'support/Utils';
import './style.css';

const LeftMenu = ({ open }) => {
  const { user } = useContext(StoreContext)
  const [messages] = useState(0)
  const menuOpen = open ? 'left_bar open' : 'left_bar'

  return (
    <aside className={menuOpen}>
      <nav className="main_nav">
        <ul className="nav_links">
          {user && (
            <li className="nav_item">
              <NavLink to="/messages">
                <span className="nav_text">Messages</span>
                {messages > 0 && <span className="nav_counter">{counter(messages)}</span>}
              </NavLink>
            </li>
          )}
          <li className="nav_item">
            <NavLink to="/boards">
              <span className="nav_text">All boards</span>
            </NavLink>
          </li>
          <li className="nav_item">
            <NavLink to="/uploads">
              <span className="nav_text">Uploads</span>
            </NavLink>
          </li>
          <li className="nav_item">
            <NavLink to="/users">
              <span className="nav_text">Users</span>
            </NavLink>
          </li>
          <li className="nav_item">
            <NavLink to="/admin">
              <span className="nav_text">Admins</span>
            </NavLink>
          </li>
          <li className="nav_item">
            <NavLink to="/rules">
              <span className="nav_text">Rules</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default LeftMenu;

import { Fragment, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from 'store/Store';

const Header = ({ setMenuState }) => {
  const { user } = useContext(StoreContext)
  const [notification] = useState(false)

  return (
    <header className="app_head">
      <div className="head_inner">
        <div className="head_left">
          <div className="open_nav" onClick={() => setMenuState()}>
            <i className="bx bx-menu"></i>
          </div>
          <h1 className="app_name">Forum</h1>
        </div>
        <ul className="head_act">
          <li className="head_search">
            <input className="head_search_field" type="search" placeholder="Enter for search..." />
            <i className="head_search_ic bx bx-search"></i>
          </li>

          {user ? (
            <Fragment>
              <li className="head_act_item">
                {notification
                  ? <i className="bx bx-notification bx-tada"></i>
                  : <i className="bx bx-notification"></i>
                }
              </li>
              <li className="head_act_item">
                <div className="head_profile" style={user.picture && { backgroundImage: `url(${user.picture})` }}>
                  {!user.picture && user.username.charAt(0)}
                </div>
              </li>
            </Fragment>
          ) : (
           <Fragment>
              <li className="head_auth">
                <Link to="/signup" className="btn media_hide">
                  <i className="bx bx-user-plus"></i>
                  <span>Sign Up</span>
                </Link>
              </li>
              <li className="head_auth">
                <Link to="/signin" className="btn media_hide hollow">
                  <i className="bx bx-log-in"></i>
                  <span>Sign In</span>
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
import { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { StoreContext } from 'store/Store';

import CustomScrollbar from 'components/CustomScrollbar';
import './style.css';

const DropdownItem = ({ onClick, data, setActiveMenu, goToMenu, leftIcon, rightIcon, header, children }) => {
  const dropHeader = header ? ' drop-header' : ''

  const click = () => {
    goToMenu && setActiveMenu(goToMenu)

    onClick && onClick(data)
  }

  return (
    <span className={'menu-item' + dropHeader} onClick={click}>
      {leftIcon && (
        <span className="icon-button">
          <i className={'bx bx-' + leftIcon}></i>
        </span>
      )}
      {children}
      {rightIcon && (
        <span className="icon-right">
          <i className={'bx bx-' + rightIcon}></i>
        </span>
      )}
    </span>
  )
}

const DropdownMenu = ({ user, logout, setDropdownOpen }) => {
  const history = useHistory()
  const [activeMenu, setActiveMenu] = useState('main')
  const [menuHeight, setMenuHeight] = useState(null)
  const dropdown = useRef()
  const [lang, setLang] = useState('en')

  useEffect(() => {
    setMenuHeight(dropdown.current?.querySelector('.menu').offsetHeight + 16)
  }, [])

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  })

  const handleClickOutside = ({ target }) => {
    if (dropdown.current?.contains(target)) return

    setDropdownOpen(false)
  }

  const calcHeight = (el) => {
    const height = el.offsetHeight
    setMenuHeight(height + 12)
  }

  const setLanguage = (data) => {
    setLang(data.lang)
  }

  const goTo = (data) => {
    setDropdownOpen(false)
    history.push(data.url)
  }

  const changeTheme = () => {
    if (localStorage.getItem('theme') === 'light') {
      localStorage.setItem('theme', 'dark')
      document.body.classList.remove('light')
      document.querySelector('meta[name="theme-color"]').setAttribute('content', '#161616')
    } else {
      localStorage.setItem('theme', 'light')
      document.body.classList.add('light')
      document.querySelector('meta[name="theme-color"]').setAttribute('content', '#eef0f1')
    }
  }

  const onLogout = () => {
    setDropdownOpen(false)
    logout()
  }

  return (
    <div className="head_dropdown" style={{ height: menuHeight }} ref={dropdown}>
      <CustomScrollbar className="navigation__menu">

        <CSSTransition
          in={activeMenu === 'main'}
          timeout={300}
          classNames="menu-primary"
          unmountOnExit
          onEnter={calcHeight}
        >
          <div className="menu">
            <DropdownItem
              leftIcon="user"
              onClick={goTo}
              data={{ url: '/user/' + user.id }}
            >
              <div className="menu-item-title">Open profile</div>
            </DropdownItem>
            <DropdownItem
              leftIcon="world"
              rightIcon="chevron-right"
              goToMenu="language"
              setActiveMenu={setActiveMenu}
            >
              <div className="menu-item-title">Language</div>
            </DropdownItem>
            <DropdownItem
              leftIcon="palette"
              onClick={changeTheme}
            >
              <div className="menu-item-title">Toggle theme</div>
            </DropdownItem>
            <DropdownItem
              leftIcon="log-out"
              onClick={onLogout}
            >
              <div className="menu-item-title">Logout</div>
            </DropdownItem>
          </div>
        </CSSTransition>

        <CSSTransition
          in={activeMenu === 'language'}
          timeout={300}
          classNames="menu-secondary"
          unmountOnExit
          onEnter={calcHeight}>
          <div className="menu">
            <DropdownItem
              goToMenu="main"
              leftIcon="left-arrow-alt"
              setActiveMenu={setActiveMenu}
              header
            >
              <div className="menu-item-title">Language</div>
            </DropdownItem>
            <DropdownItem
              goToMenu="main"
              onClick={setLanguage}
              data={{ lang: 'ru'}}
              rightIcon={lang === 'ru' ? 'check' : '' }
              setActiveMenu={setActiveMenu}
            >
              <div className="menu-item-title">Russian</div>
            </DropdownItem>
            <DropdownItem
              goToMenu="main"
              onClick={setLanguage}
              data={{ lang: 'en'}}
              rightIcon={lang === 'en' ? 'check' : '' }
              setActiveMenu={setActiveMenu}
            >
              <div className="menu-item-title">English</div>
            </DropdownItem>
          </div>
        </CSSTransition>

      </CustomScrollbar>
    </div>
  )
}

const Dropdown = () => {
  const { user, logout } = useContext(StoreContext)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <li className="head_act_item">
      <div
        className="head_profile"
        style={user.picture && { backgroundImage: `url(${user.picture})` }}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {!user.picture && user.username.charAt(0)}
      </div>

      {dropdownOpen && <DropdownMenu user={user} logout={logout} setDropdownOpen={setDropdownOpen} />}
    </li>
  )
}

export default Dropdown;

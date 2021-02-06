import { Fragment, useContext, useState } from 'react';
import { StoreContext } from 'store/Store';

import Header from 'components/Header';
import LeftMenu from 'components/LeftMenu';
import Modal from 'components/Modal';
import Footer from 'components/Footer';

const Layout = ({ children }) => {
  const { user } = useContext(StoreContext)
  const [menuOpen, setMenuOpen] = useState(false)
  const coverOpen = menuOpen ? 'cover open' : 'cover'

  return (
    <Fragment>
      <Header setMenuState={() => setMenuOpen(!menuOpen)} />

      <section className="container">
        <LeftMenu open={menuOpen} />

        <main className="content">
          {children}

          <Footer />
        </main>

        {user && (
          <div className="fab">
            <span>Create new</span>
            <i className="bx bx-pencil"></i>
          </div>
        )}
      </section>

      {user && <Modal />}

      <div className={coverOpen} onClick={() => setMenuOpen(false)}></div>
    </Fragment>
  )
}

export default Layout;
import { Fragment, useContext, useEffect, useState } from 'react';
import { StoreContext } from 'store/Store';

import Header from 'components/Header';
import LeftMenu from 'components/LeftMenu';
import Modal from 'components/Modal';
import Footer from 'components/Footer';
import './style.css';

const Layout = ({ children }) => {
  const { user, postType } = useContext(StoreContext)
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const coverOpen = menuOpen || modalOpen  ? 'cover open' : 'cover'

  const fabClick = () => {
    setModalOpen(!modalOpen)
  }

  const coverClick = () => {
    menuOpen && setMenuOpen(!menuOpen)
    modalOpen && setModalOpen(!modalOpen)
  }

  useEffect(() => {
    if (menuOpen || modalOpen) {
      document.body.classList.add('noscroll')
    } else {
      document.body.classList.remove('noscroll')
    }
  }, [menuOpen, modalOpen])

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
          <div className="fab" onClick={fabClick}>
            {postType.type === 'answer' ? (
              <Fragment>
                <span>Answer</span>
                <i className="bx bx-pencil"></i>
              </Fragment>
            ) : (
              <Fragment>
                <span>Create new</span>
                <i className="bx bx-pencil"></i>
              </Fragment>
            )}
          </div>
        )}
      </section>

      {user && <Modal open={modalOpen} close={() => setModalOpen(false)} />}

      <div className={coverOpen} onClick={coverClick}></div>
    </Fragment>
  )
}

export default Layout;

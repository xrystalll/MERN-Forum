import { useContext, useEffect, useState } from 'react';

import { StoreContext } from 'store/Store';

import Footer from 'components/Layout/Footer';

import Boards from './Boards';
import Threads from './Threads';
import Uploads from './Uploads';

const Home = () => {
  document.title = 'Forum'
  const { setPostType, setFabVisible, lang } = useContext(StoreContext)
  const [init, setInit] = useState(true)

  useEffect(() => {
    if (init) {
      setFabVisible(true)
      setPostType({
        type: 'thread',
        id: null
      })
    }
    setInit(false)
    // eslint-disable-next-line
  }, [init])

  return (
    <>
      {navigator.onLine && <Boards lang={lang} />}
      <Threads lang={lang} />
      {navigator.onLine && <Uploads lang={lang} />}
      <Footer />
    </>
  )
}

export default Home;

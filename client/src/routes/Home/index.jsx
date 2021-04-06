import { Fragment, useContext, useEffect, useState } from 'react';

import { StoreContext } from 'store/Store';

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
    <Fragment>
      <Boards lang={lang} />
      <Threads lang={lang} />
      <Uploads lang={lang} />
    </Fragment>
  )
}

export default Home;

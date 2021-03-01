import { Fragment, useContext, useEffect, useState } from 'react';

import { StoreContext } from 'store/Store';


import Boards from './Boards';
import Threads from './Threads';
import Uploads from './Uploads';

const Home = () => {
  document.title = 'Forum'
  const { setPostType, setFabVisible } = useContext(StoreContext)
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
  }, [setInit, init, setPostType, setFabVisible])

  return (
    <Fragment>
      <Boards />
      <Threads />
      <Uploads />
    </Fragment>
  )
}

export default Home;

import { Fragment, useContext, useEffect, useState } from 'react';

import { StoreContext } from 'store/Store';

import { BACKEND } from 'support/Constants';

import { SectionHeader } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const Profile = ({ userId }) => {
  const { user, token } = useContext(StoreContext)

  const [init, setInit] = useState(true)
  const [userData, setUserData] = useState({})
  const [loading, setLoading] = useState(true)
  const [noData, setNoData] = useState(false)

  useEffect(() => {
    const profileName = userData.displayName || ''
    document.title = 'Forum | Profile ' + profileName
    const fetchUser = async () => {
      try {
        const isProfileApi = user.id === userId ? '/profile' : `/user?userId=${userId}`
        const data = await fetch(`${BACKEND}/api${isProfileApi}`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
        const response = await data.json()

        if (!response.error) {
          setInit(false)
          setUserData(response)
          setLoading(false)
          setNoData(false)
        } else throw Error(response.error.message)
      } catch(err) {
        setInit(false)
        setLoading(false)
        setNoData(true)
      }
    }

    init && fetchUser()
  }, [init, userData])

  return (
    <Fragment>
      <Breadcrumbs current={userData.displayName || 'View profile'} links={[
        { title: 'Home', link: '/' },
        { title: 'Users', link: '/users' }
      ]} />

      {!noData ? (
        !loading ? (
          <Fragment>
            <SectionHeader title={userData.displayName} />

          </Fragment>
        ) : (
          <Loader color="#64707d" />
        )
      ) : (
        <Errorer message="Unable to display user profile" />
      )}
    </Fragment>
  )
}

export default Profile;

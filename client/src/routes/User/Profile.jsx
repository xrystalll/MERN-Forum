import { Fragment, useContext, useEffect, useState } from 'react';

import { StoreContext } from 'store/Store';

import { BACKEND } from 'support/Constants';
import { dateFormat } from 'support/Utils';

import Breadcrumbs from 'components/Breadcrumbs';
import { BanInfoCard } from 'components/Card';
import { LinkButton } from 'components/Button';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const Profile = ({ userName }) => {
  const { user, token } = useContext(StoreContext)

  const [userData, setUserData] = useState({})
  const [loading, setLoading] = useState(true)
  const [noData, setNoData] = useState(false)

  useEffect(() => {
    const profileName = userData.displayName || userName
    document.title = 'Forum | Profile ' + profileName

    if (!loading) {
      if (userData.name === userName) return
    }

    const fetchUser = async () => {
      try {
        const isProfileApi = user.name === userName ? '/profile' : `/user?userName=${userName}`
        const data = await fetch(`${BACKEND}/api${isProfileApi}`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
        const response = await data.json()

        if (!response.error) {
          setUserData(response)
          setLoading(false)
          setNoData(false)
        } else throw Error(response.error?.message || 'Error')
      } catch(err) {
        setNoData(true)
        setLoading(false)
      }
    }

    fetchUser()
  }, [userData, userName])

  return (
    <Fragment>
      <Breadcrumbs current={userData.displayName || userName} links={[
        { title: 'Home', link: '/' },
        { title: 'Users', link: '/users' }
      ]} />

      {!noData ? (
        !loading ? (
          <Fragment>
            {userData.ban && (
              <BanInfoCard data={userData.ban} />
            )}

            <div className="card_item">
              <div className="card_body">
                <div className="card_block">
                  <div className="profile_head">
                    {userData.picture ? (
                      <div className="profile_picture" style={{ backgroundImage: `url(${BACKEND + userData.picture})` }} />
                    ) : (
                      <div className="profile_picture">{userData.displayName.charAt(0)}</div>
                    )}

                    <div className="profile_head_right">
                      <div className="profile_username">
                        {userData.displayName}
                        {userData.role === 'admin' && <span className="user_status">admin</span>}
                      </div>
                      <div>{new Date() - new Date(userData.onlineAt) < 5 * 60000 ? 'online' : 'Last seen ' + dateFormat(userData.onlineAt)}</div>

                      {user.id === userData._id && (
                        <div className="profile_head_actions">
                          <LinkButton link={'/user/' + userData.name + '/settings'} className="hollow" text="Settings" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        ) : <Loader color="#64707d" />
      ) : (
        <Errorer message="Unable to display user profile" />
      )}
    </Fragment>
  )
}

export default Profile;

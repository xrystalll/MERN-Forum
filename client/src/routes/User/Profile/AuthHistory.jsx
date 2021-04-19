import { Fragment, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { StoreContext } from 'store/Store';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { Strings } from 'support/Constants';

import { SectionHeader } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import { AuthHistoryCard } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const AuthHistory = ({ userData }) => {
  const { user, lang } = useContext(StoreContext)
  document.title = 'Forum | ' + userData.displayName + ' / ' + Strings.authorizationsHistory[lang]
  const history = useHistory()

  useEffect(() => {
    if (user.role === 1) {
      if (user.id !== userData._id) {
        history.push('/user/' + userData.name)
      }
    }
    // eslint-disable-next-line
  }, [])

  const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'user/authHistory', params: { userId: userData._id }, auth: true })

  return (
    <Fragment>
      <Breadcrumbs current={Strings.authorizationsHistory[lang]} links={[
        { title: Strings.home[lang], link: '/' },
        { title: Strings.users[lang], link: '/users' },
        { title: userData.displayName, link: '/user/' + userData.name }
      ]} />

      <SectionHeader title={Strings.authorizationsHistory[lang]} />

      {!noData ? (
        !loading ? (
          items.length ? (
            <Fragment>
              <div className="items_list">
                {items.map(item => (
                  <AuthHistoryCard key={item._id} data={item} />
                ))}
              </div>

              {moreLoading && <Loader className="more_loader" color="#64707d" />}
            </Fragment>
          ) : <Errorer message={Strings.userHasNotLoggedInYet[lang]} />
        ) : <Loader color="#64707d" />
      ) : (
        <Errorer message={Strings.unableToDisplayAuthorizationsHistory[lang]} />
      )}

    </Fragment>
  )
}

export default AuthHistory;

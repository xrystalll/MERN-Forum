import { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { StoreContext } from 'store/Store';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { Strings } from 'support/Constants';

import { SectionHeader } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import DataView from 'components/DataView';
import { AuthHistoryCard } from 'components/Card';

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
    <>
      <Breadcrumbs current={Strings.authorizationsHistory[lang]} links={[
        { title: Strings.home[lang], link: '/' },
        { title: Strings.users[lang], link: '/users' },
        { title: userData.displayName, link: '/user/' + userData.name }
      ]} />

      <SectionHeader title={Strings.authorizationsHistory[lang]} />

      <DataView
        data={items}
        noData={noData}
        loading={loading}
        moreLoading={moreLoading}
        card={AuthHistoryCard}
        noDataMessage={Strings.userHasNotLoggedInYet[lang]}
        errorMessage={Strings.unableToDisplayAuthorizationsHistory[lang]}
      />
    </>
  )
}

export default AuthHistory;

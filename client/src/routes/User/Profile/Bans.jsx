import { useContext } from 'react';
import { toast } from 'react-toastify';

import { StoreContext } from 'store/Store';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { BACKEND, Strings } from 'support/Constants';

import { SectionHeader } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import DataView from 'components/DataView';
import { BannedAll } from 'components/Card';

const Bans = ({ userData }) => {
  const { user, token, lang } = useContext(StoreContext)
  document.title = 'Forum | ' + userData.displayName + ' / ' + Strings.bans[lang]

  const { loading, moreLoading, noData, items, setItems } = useMoreFetch({ method: 'user/bans', params: { userId: userData._id }, auth: true })

  const deleteBan = (banId) => {
    const conf = window.confirm(`${Strings.delete[lang]}?`)

    if (!conf) return

    fetch(BACKEND + '/api/ban/history/delete', {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ banId })
    })
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          toast.success(data.message)
          setItems(items.filter(item => item._id !== banId))
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
  }

  return (
    <>
      <Breadcrumbs current={Strings.bans[lang]} links={[
        { title: Strings.home[lang], link: '/' },
        { title: Strings.users[lang], link: '/users' },
        { title: userData.displayName, link: '/user/' + userData.name }
      ]} />

      <SectionHeader title={Strings.bans[lang]} />

      <DataView
        data={items}
        noData={noData}
        loading={loading}
        moreLoading={moreLoading}
        card={user.role >= 2 ? (props) => <BannedAll {...props} deleteBan={deleteBan} /> : BannedAll}
        noDataMessage={Strings.noBansYet[lang]}
        errorMessage={Strings.unableToDisplayBans[lang]}
      />
    </>
  )
}

export default Bans;

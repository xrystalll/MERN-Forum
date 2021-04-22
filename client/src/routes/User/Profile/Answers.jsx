import { Fragment, useContext } from 'react';

import { StoreContext } from 'store/Store';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { Strings } from 'support/Constants';

import Breadcrumbs from 'components/Breadcrumbs';
import DataView from 'components/DataView';
import { Card } from 'components/Card';

const Answers = ({ userData }) => {
  const { lang } = useContext(StoreContext)
  document.title = 'Forum | ' + userData.displayName + ' / ' + Strings.answers[lang]

  const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'user/answers', params: { userId: userData._id }, auth: true })

  return (
    <Fragment>
      <Breadcrumbs current={Strings.answers[lang]} links={[
        { title: Strings.home[lang], link: '/' },
        { title: Strings.users[lang], link: '/users' },
        { title: userData.displayName, link: '/user/' + userData.name }
      ]} />

      <DataView
        data={items}
        noData={noData}
        loading={loading}
        moreLoading={moreLoading}
        card={(props) => <Card {...props} preview type="answer" />}
        noDataMessage={Strings.noAnswersYet[lang]}
        errorMessage={Strings.unableToDisplayAnswers[lang]}
      />
    </Fragment>
  )
}

export default Answers;

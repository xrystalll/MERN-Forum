import { Fragment } from 'react';
import { useQuery } from '@apollo/client';

import { Section, SectionHeader } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

import { USER_QUERY } from 'support/Queries';

const User = ({ match }) => {
  document.title = 'Forum | User'
  const { userId } = match.params
  const { loading, data } = useQuery(USER_QUERY, {
    variables: {
      id: userId
    }
  })

  return !loading ? (
    <Section>
      {data ? (
        <Fragment>
          <Breadcrumbs current={data.getUser.username} links={[
            { title: 'Home', link: '/' },
            { title: 'Users', link: '/users' }
          ]} />

          <SectionHeader title={data.getUser.username} />

        </Fragment>
      ) : (
        <Fragment>
          <Breadcrumbs current="Error" links={[
            { title: 'Home', link: '/' }
          ]} />
          <Errorer message="Unable to display user profile" />
        </Fragment>
      )}
    </Section>
  ) : (
    <Loader color="#64707d" />
  )
}

export default User;

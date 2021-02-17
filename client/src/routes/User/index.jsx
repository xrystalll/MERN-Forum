import { Fragment, useContext, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import { StoreContext } from 'store/Store';

import { Section, SectionHeader } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import FileUploadForm from 'components/Form/FileUploadForm';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

import { USER_QUERY } from 'support/Queries';
import { UPLOAD_USER_PICTURE } from 'support/Mutations';

const User = ({ match }) => {
  document.title = 'Forum | User'
  const { userId } = match.params
  const { user } = useContext(StoreContext)
  const { loading, data } = useQuery(USER_QUERY, {
    variables: { id: userId }
  })

  const [file, setFile] = useState({})

  const getFile = (files) => {
    setFile(files)
  }

  const [uploadUserAvatar, { loadingUpload }] = useMutation(UPLOAD_USER_PICTURE, {
    onCompleted: (data) => console.log(data)
  })

  const upload = () => {
    if (true) return // Upload not working on backend
    if (!file.length) return

    uploadUserAvatar({
      variables: {
        id: userId,
        file: file[0]
      }
    })
  }

  return !loading ? (
    <Section>
      {data ? (
        <Fragment>
          <Breadcrumbs current={data.getUser.username} links={[
            { title: 'Home', link: '/' },
            { title: 'Users', link: '/users' }
          ]} />

          <SectionHeader title={data.getUser.username} />

          {user.id === userId && (
            <Fragment>
              <FileUploadForm
                hint="Accepted: png, jpg, jpeg; Max files count: 1"
                multiple={false}
                accept="image/jpeg,image/png"
                sendFiles={getFile}
              />

              <div className="card_item">
                <Button text="Upload" onClick={upload} className="main hollow" />
              </div>
            </Fragment>
          )}
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

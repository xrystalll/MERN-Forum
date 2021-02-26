import { Fragment, useContext, useEffect, useState } from 'react';

import { StoreContext } from 'store/Store';

import { Section, SectionHeader } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import FileUploadForm from 'components/Form/FileUploadForm';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const User = ({ match }) => {
  const { userId } = match.params
  const { user, setUserPicture, token } = useContext(StoreContext)

  const [init, setInit] = useState(true)
  const [userData, setUserData] = useState({})
  const [loading, setLoading] = useState(true)
  const [noData, setNoData] = useState(false)

  useEffect(() => {
    const profileName = userData.displayName || ''
    document.title = 'Forum | Profile ' + profileName
    const fetchUser = async () => {
      try {
        const isProfile = user.id === userId ? '/profile' : `/user?userId=${userId}`
        const data = await fetch(`${'http://localhost:8000'}/api${isProfile}`, {
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

  const [file, setFile] = useState([])
  const [uploading, setUploading] = useState(false)
  const [clearFiles, setClearFiles] = useState(false)

  const getFile = (files) => {
    setClearFiles(false)
    setFile(files)
  }

  useEffect(() => {
    if (clearFiles) {
      setFile([])
    }
  }, [clearFiles])

  const upload = () => {
    if (uploading) return
    if (!file.length) return

    setUploading(true)

    const formData = new FormData()
    formData.append('picture', file[0])

    fetch('http://localhost:8000' + '/api/profile/upload/picture', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token
      },
      body: formData
    })
      .then(response => {
        setClearFiles(true)
        setUploading(false)
        return response.json()
      })
      .then(data => {
        if (data.picture) {
          setUserPicture(data.picture)
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => {
        console.error(err)
      })
  }

  return (
    <Section>
      <Breadcrumbs current={userData.displayName || 'View profile'} links={[
        { title: 'Home', link: '/' },
        { title: 'Users', link: '/users' }
      ]} />

      {!noData ? (
        !loading ? (
          <Fragment>
            <SectionHeader title={userData.displayName} />

            {user.id === userId && (
              <Fragment>
                <FileUploadForm
                  hint="Accepted: png, jpg, jpeg, gif; Max files count: 1; Max size: 8 Mb"
                  multiple={false}
                  accept="image/jpeg,image/png,image/gif"
                  sendFiles={getFile}
                  clearFiles={clearFiles}
                />

                <div className="card_item">
                  {uploading
                    ? <Loader className="btn main" />
                    : <Button text="Upload" onClick={upload} className="main hollow" />
                  }
                </div>
              </Fragment>
            )}
          </Fragment>
        ) : (
          <Loader color="#64707d" />
        )
      ) : (
        <Errorer message="Unable to display user profile" />
      )}
    </Section>
  )
}

export default User;

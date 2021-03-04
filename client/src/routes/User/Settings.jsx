import { Fragment, useContext, useEffect, useState } from 'react';

import { StoreContext } from 'store/Store';

import { BACKEND } from 'support/Constants';

import { SectionHeader } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import FileUploadForm from 'components/Form/FileUploadForm';
import { Button } from 'components/Button';
import Loader from 'components/Loader';

const Settings = () => {
  document.title = 'Forum | Profile settings'
  const { user, setUserPicture, token } = useContext(StoreContext)

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

    fetch(BACKEND + '/api/profile/upload/picture', {
      method: 'PUT',
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
      .catch(err => console.error)
  }

  return (
    <Fragment>
      <Breadcrumbs current="Settings" links={[
        { title: 'Home', link: '/' },
        { title: 'Users', link: '/users' },
        { title: user.displayName, link: '/user/' + user.id }
      ]} />

      <SectionHeader title="Profile settings" />

      <FileUploadForm
        title="Upload profile picture"
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
  )
}

export default Settings;

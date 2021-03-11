import { Fragment, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { StoreContext } from 'store/Store';

import { BACKEND, Strings } from 'support/Constants';

import { SectionHeader } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import FileUploadForm from 'components/Form/FileUploadForm';
import { Button } from 'components/Button';
import Loader from 'components/Loader';

const Settings = ({ match }) => {
  const { user, setUserPicture, token, lang } = useContext(StoreContext)
  document.title = 'Forum | ' + Strings.profileSettings[lang]
  const { userName } = match.params
  const history = useHistory()

  useEffect(() => {
    if (user.name !== userName) {
      history.push('/user/' + user.name + '/settings')
    }
  }, [])

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
      .catch(err => toast.error(err.message))
  }

  return (
    <Fragment>
      <Breadcrumbs current={Strings.settings[lang]} links={[
        { title: Strings.home[lang], link: '/' },
        { title: Strings.users[lang], link: '/users' },
        { title: user.displayName, link: '/user/' + user.name }
      ]} />

      <SectionHeader title={Strings.profileSettings[lang]} />

      <FileUploadForm
        title={Strings.uploadProfilePicture[lang]}
        hint={`${Strings.accepted[lang]}: png, jpg, jpeg, gif; ${Strings.maxFilesCount[lang]}: 1; ${Strings.maxSize[lang]}: 8 Mb`}
        multiple={false}
        accept="image/jpeg,image/png,image/gif"
        sendFiles={getFile}
        clearFiles={clearFiles}
      />

      <div className="card_item">
        {uploading
          ? <Loader className="btn main" />
          : <Button text={Strings.upload[lang]} onClick={upload} className="main hollow" />
        }
      </div>
    </Fragment>
  )
}

export default Settings;

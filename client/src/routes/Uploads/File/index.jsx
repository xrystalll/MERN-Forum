import { Fragment, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { StoreContext } from 'store/Store';

import { BACKEND, Strings } from 'support/Constants';
import Socket, { joinToRoom, leaveFromRoom } from 'support/Socket';

import { Section } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

import FileContent from './FileContent';
import Comments from './Comments';

const File = ({ history, match }) => {
  const { user, token, setPostType, setFabVisible, setModalOpen, lang } = useContext(StoreContext)
  const [init, setInit] = useState(true)
  const { fileId } = match.params

  useEffect(() => {
    if (init) {
      setFabVisible(false)
      setPostType({
        type: 'upload',
        id: null
      })
    }
    setInit(false)
  }, [init])

  const [fetchInit, setFetchInit] = useState(true)
  const [folder, setFolder] = useState({})
  const [file, setFile] = useState({})
  const [loading, setLoading] = useState(true)
  const [noData, setNoData] = useState(false)
  const [onModeration, setOnModeration] = useState(false)
  const [commentsSubscribed, setCommentsSubscribed] = useState({})

  useEffect(() => {
    const fileTitle = file.title || Strings.file[lang]
    document.title = 'Forum | ' + fileTitle

    const fetchFile = async () => {
      try {
        const data = await fetch(`${BACKEND}/api/file?fileId=${fileId}`)
        const response = await data.json()

        if (!response.error) {
          setFetchInit(false)
          setFolder(response.folder)
          if (!response.message) {
            setFile(response.file)
            setNoData(false)
          } else {
            setOnModeration(true)
            setNoData(true)
          }
          setLoading(false)
        } else throw Error(response.error?.message || 'Error')
      } catch(err) {
        setFetchInit(false)
        setNoData(true)
        setLoading(false)
      }
    }

    fetchInit && fetchFile()
  }, [fetchInit, file])

  useEffect(() => {
    if (file._id) joinToRoom('file:' + file._id)
    return () => {
      if (file._id) leaveFromRoom('file:' + file._id)
    }
  }, [file._id])

  useEffect(() => {
    Socket.on('fileDeleted', (data) => {
      history.push('/uploads/' + folder.name)
    })
    Socket.on('fileEdited', (data) => {
      setFile(data)
    })
    Socket.on('fileLiked', (data) => {
      setFile(data)
    })
    Socket.on('fileDownloaded', (data) => {
      setFile(data)
    })
    Socket.on('commentCreated', (data) => {
      setCommentsSubscribed({ type: 'commentCreated', payload: data })
    })
    Socket.on('commentDeleted', (data) => {
      setCommentsSubscribed({ type: 'commentDeleted', payload: data })
    })
    Socket.on('commentLiked', (data) => {
      setCommentsSubscribed({ type: 'commentLiked', payload: data })
    })
  }, [])

  const deleteFile = () => {
    fetch(BACKEND + '/api/file/delete', {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileId })
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          history.push('/uploads/' + folder.name)
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => toast.error(err.message))
  }

  const editFile = () => {
    setPostType({
      type: 'fileEdit',
      id: fileId,
      someData: {
        title: file.title,
        body: file.body
      }
    })
    setModalOpen(true)
  }

  return (
    <Section>
      {!noData ? (
        !loading ? (
          <Fragment>
            <Breadcrumbs current={file.title} links={[
              { title: Strings.home[lang], link: '/' },
              { title: Strings.uploadsFolders[lang], link: '/uploads' },
              { title: folder.title, link: '/uploads/' + folder.name }
            ]} />

            <FileContent
              data={file}
              user={user}
              token={token}
              lang={lang}
              deleteFile={deleteFile}
              editFile={editFile}
            />

            <br />

            <Comments
              lang={lang}
              user={user}
              token={token}
              fileId={file._id}
              subcribed={commentsSubscribed}
              clearSubcribe={setCommentsSubscribed}
            />
          </Fragment>
        ) : <Loader color="#64707d" />
      ) : (
        <Fragment>
          <Breadcrumbs current={onModeration ? Strings.onModeration[lang] : Strings.error[lang]} links={[
            { title: Strings.home[lang], link: '/' },
            { title: Strings.uploadsFolders[lang], link: '/uploads' }
          ]} />

          <Errorer
            message={onModeration ? Strings.theFileWillBePublishedAfterModeration[lang] : Strings.fileNotFound[lang]}
          />
        </Fragment>
      )}
    </Section>
  )
}

export default File;

import { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { StoreContext } from 'store/Store';
import { useForm } from 'hooks/useForm';

import { BACKEND } from 'support/Constants';

import ModalBody from './ModalBody';
import FormCardItem from 'components/Card/FormCardItem';
import Input from 'components/Form/Input';
import TextareaForm from 'components/Form/TextareaForm';
import FileUploadForm from 'components/Form/FileUploadForm';
import { InputButton } from 'components/Button';
import Loader from 'components/Loader';

const Modal = ({ open, close }) => {
  const history = useHistory()
  const { postType, setPostType, token } = useContext(StoreContext)
  const modalOpen = open ? 'modal open' : 'modal'
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const formCallback = () => {
    setErrors({})

    if (postType.type === 'thread') {
      if (!values.title) {
        return setErrors({ title: 'Enter thread title' })
      }
      if (!values.body) {
        return setErrors({ body: 'Enter content' })
      }
      if (!values.boardId) {
        return setErrors({ boardId: 'Choose from list' })
      }

      setLoading(true)
      createThread()
    }

    if (postType.type === 'userThreadEdit') {
      if (!values.title) {
        return setErrors({ title: 'Enter thread title' })
      }
      if (!values.body) {
        return setErrors({ body: 'Enter content' })
      }

      setLoading(true)
      editThread()
    }

    if (postType.type === 'adminThreadEdit') {
      if (!values.title) {
        return setErrors({ title: 'Enter thread title' })
      }
      if (!values.body) {
        return setErrors({ body: 'Enter content' })
      }

      setLoading(true)
      adminEditThread()
    }

    if (postType.type === 'answer') {
      if (!values.body) {
        return setErrors({ body: 'Enter content' })
      }

      setLoading(true)
      createAnswer()
    }

    if (postType.type === 'answerEdit') {
      if (!values.body) {
        return setErrors({ body: 'Enter content' })
      }

      setLoading(true)
      editAnswer()
    }
  }

  const { onChange, onSubmit, values } = useForm(formCallback, {
    boardId: postType.id || '',
    title: postType?.someData?.title || '',
    body: postType?.someData?.body || ''
  })

  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [clearFiles, setClearFiles] = useState(false)

  const getFile = (files) => {
    setClearFiles(false)
    setFiles(files)
  }

  useEffect(() => {
    if (clearFiles) {
      setFiles([])
    }
  }, [clearFiles])

  const [boards, setBoards] = useState([])
  const pagination = false

  const loadBoards = () => {
    if (boards.length) return

    fetch(`${BACKEND}/api/boards?pagination=${pagination}`)
      .then(response => response.json())
      .then(data => {
        if (data.docs?.length) {
          setBoards(data.docs)
        } else throw Error('Boards not loaded')
      })
      .catch(err => {
        setErrors({ general: err.message })
      })
  }

  const createThread = () => {
    const formData = new FormData()
    files.map(item => formData.append('attach', item))
    formData.append('postData', JSON.stringify({
      boardId: values.boardId,
      title: values.title.substring(0, 100),
      body: values.body.substring(0, 1000)
    }))

    fetch(BACKEND + '/api/thread/create', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token
      },
      body: formData
    })
      .then(response => {
        setLoading(false)
        return response.json()
      })
      .then(data => {
        if (!data.error) {
          close()
          history.push('/thread/' + data._id)
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => {
        setErrors({ general: err.message })
      })
  }

  const editThread = () => {
    fetch(BACKEND + '/api/thread/edit', {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        threadId: postType.id,
        title: values.title.substring(0, 100),
        body: values.body.substring(0, 1000)
      })
    })
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          close()
          setPostType({
            type: 'answer',
            id: postType.id
          })
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => {
        setErrors({ general: err.message })
      })
  }

  const adminEditThread = () => {
    fetch(BACKEND + '/api/thread/adminedit', {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        threadId: postType.id,
        title: values.title.substring(0, 100),
        body: values.body.substring(0, 1000)
      })
    })
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          close()
          setPostType({
            type: 'answer',
            id: postType.id
          })
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => {
        setErrors({ general: err.message })
      })
  }

  const createAnswer = () => {
    const formData = new FormData()
    files.map(item => formData.append('attach', item))
    formData.append('postData', JSON.stringify({
      threadId: postType.id,
      body: values.body.substring(0, 1000),
      answeredTo: postType?.someData?.toId || null
    }))

    fetch(BACKEND + '/api/answer/create', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token
      },
      body: formData
    })
      .then(response => {
        setLoading(false)
        return response.json()
      })
      .then(data => {
        if (!data.error) {
          close()
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => {
        setErrors({ general: err.message })
      })
  }

  const editAnswer = () => {
    fetch(BACKEND + '/api/answer/edit', {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        answerId: postType?.someData?.id || '',
        body: values.body.substring(0, 1000)
      })
    })
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          close()
          setPostType({
            type: 'answer',
            id: postType.id
          })
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => {
        setErrors({ general: err.message })
      })
  }

  const threadContent = (
    <ModalBody title="New thread" onClick={close}>
      <form className="form_inner" onSubmit={onSubmit}>
        <FormCardItem title="Thread title" error={errors.title}>
          <div className={errors.title ? 'form_block error' : 'form_block' }>
            <Input
              name="title"
              value={values.title}
              placeholder="Enter title"
              maxLength="100"
              onChange={onChange}
            />
          </div>
        </FormCardItem>

        <FormCardItem title="Content" error={errors.body}>
          <TextareaForm
            className={errors.body ? 'form_block error' : 'form_block' }
            name="body"
            value={values.body}
            placeholder="Enter your message"
            onChange={onChange}
          />
        </FormCardItem>

        <FileUploadForm
          sendFiles={getFile}
          clearFiles={clearFiles}
        />

        <FormCardItem title="Choose board" error={errors.boardId}>
          <div className={errors.boardId ? 'form_block select error' : 'form_block select' }>
            <select
              className="input_area select_area"
              name="boardId"
              value={values.boardId}
              onChange={onChange}
              onClick={loadBoards}
            >
              <option value="">Select a board</option>
              {boards.length ? (
                boards.map(item => (
                  <option key={item._id} value={item._id}>{item.title}</option>
                ))
              ) : (
                <option value="">Loading...</option>
              )}
            </select>
          </div>
        </FormCardItem>

        <div className="card_item">
          {loading
            ? <Loader className="btn" />
            : <InputButton text="Create thread" />
          }
        </div>

        {errors.general && (
          <div className="card_item">
            <span className="form_error">{errors.general}</span>
          </div>
        )}
      </form>
    </ModalBody>
  )

  const answerContent = (
    <ModalBody title="Answer in thread" onClick={close}>
      <form className="form_inner" onSubmit={onSubmit}>
        <FormCardItem title="Content" error={errors.body}>
          <TextareaForm
            className={errors.body ? 'form_block error' : 'form_block' }
            name="body"
            value={values.body}
            placeholder="Enter your message"
            onChange={onChange}
          />
        </FormCardItem>

        <FileUploadForm
          sendFiles={getFile}
          clearFiles={clearFiles}
        />

        <div className="card_item">
          {loading
            ? <Loader className="btn" />
            : <InputButton text="Answer" />
          }
        </div>

        {errors.general && (
          <div className="card_item">
            <span className="form_error">{errors.general}</span>
          </div>
        )}
      </form>
    </ModalBody>
  )

  const editAnswerContent = (
    <ModalBody title="Edit answer" onClick={close}>
      <form className="form_inner" onSubmit={onSubmit}>
        <FormCardItem title="Content" error={errors.body}>
          <TextareaForm
            className={errors.body ? 'form_block error' : 'form_block' }
            name="body"
            value={values.body}
            placeholder="Enter your message"
            onChange={onChange}
          />
        </FormCardItem>

        <FileUploadForm
          sendFiles={getFile}
          clearFiles={clearFiles}
        />

        <div className="card_item">
          {loading
            ? <Loader className="btn" />
            : <InputButton text="Edit" />
          }
        </div>

        {errors.general && (
          <div className="card_item">
            <span className="form_error">{errors.general}</span>
          </div>
        )}
      </form>
    </ModalBody>
  )

  const editThreadContent = (
    <ModalBody title="Edit thread" onClick={close}>
      <form className="form_inner" onSubmit={onSubmit}>
        <FormCardItem title="Thread title" error={errors.title}>
          <div className={errors.title ? 'form_block error' : 'form_block' }>
            <Input
              name="title"
              value={values.title}
              placeholder="Enter title"
              maxLength="100"
              onChange={onChange}
            />
          </div>
        </FormCardItem>

        <FormCardItem title="Content" error={errors.body}>
          <TextareaForm
            className={errors.body ? 'form_block error' : 'form_block' }
            name="body"
            value={values.body}
            placeholder="Enter your message"
            onChange={onChange}
          />
        </FormCardItem>

        <FileUploadForm
          sendFiles={getFile}
          clearFiles={clearFiles}
        />

        <div className="card_item">
          {loading
            ? <Loader className="btn" />
            : <InputButton text="Edit" />
          }
        </div>

        {errors.general && (
          <div className="card_item">
            <span className="form_error">{errors.general}</span>
          </div>
        )}
      </form>
    </ModalBody>
  )

  let modalContent
  if (postType.type === 'thread') {
    modalContent = threadContent
  }
  if (postType.type === 'userThreadEdit' || postType.type === 'adminThreadEdit') {
    modalContent = editThreadContent
  }
  if (postType.type === 'answer') {
    modalContent = answerContent
  }
  if (postType.type === 'answerEdit') {
    modalContent = editAnswerContent
  }

  return (
    <section className={modalOpen}>
      {modalContent}
    </section>
  )
}

export default Modal;

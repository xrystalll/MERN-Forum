import { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';

import { StoreContext } from 'store/Store';

import { useForm } from 'hooks/useForm';

import { BACKEND, Strings } from 'support/Constants';

import FormCardItem from 'components/Card/FormCardItem';
import Input from 'components/Form/Input';
import TextareaForm from 'components/Form/TextareaForm';
import FileUploadForm from 'components/Form/FileUploadForm';
import { InputButton } from 'components/Button';
import Loader from 'components/Loader';

import ModalBody from './ModalBody';
import './datePicker.css';

const Modal = ({ open, close }) => {
  const history = useHistory()
  const { postType, setPostType, token, lang } = useContext(StoreContext)
  const modalOpen = open ? 'modal open' : 'modal'
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const formCallback = () => {
    setErrors({})

    if (postType.type === 'thread') {
      if (!values.title.trim()) {
        return setErrors({ title: Strings.enterThreadTitle[lang] })
      }
      if (!values.body.trim()) {
        return setErrors({ body: Strings.enterContent[lang] })
      }
      if (!values.boardId) {
        return setErrors({ boardId: Strings.chooseFromList[lang] })
      }

      setLoading(true)
      createThread()
    }

    if (postType.type === 'userThreadEdit') {
      if (!values.title.trim()) {
        return setErrors({ title: Strings.enterThreadTitle[lang] })
      }
      if (!values.body.trim()) {
        return setErrors({ body: Strings.enterContent[lang] })
      }

      setLoading(true)
      editThread('edit')
    }

    if (postType.type === 'adminThreadEdit') {
      if (!values.title.trim()) {
        return setErrors({ title: Strings.enterThreadTitle[lang] })
      }
      if (!values.body.trim()) {
        return setErrors({ body: Strings.enterContent[lang] })
      }

      setLoading(true)
      editThread('adminedit')
    }

    if (postType.type === 'answer') {
      if (!values.body.trim()) {
        return setErrors({ body: Strings.enterContent[lang] })
      }

      setLoading(true)
      createAnswer()
    }

    if (postType.type === 'answerEdit') {
      if (!values.body.trim()) {
        return setErrors({ body: Strings.enterContent[lang] })
      }

      setLoading(true)
      editAnswer()
    }
  }

  const { onChange, onSubmit, values } = useForm(formCallback, {
    boardId: postType.id,
    title: postType?.someData?.title || '',
    body: postType?.someData?.body || ''
  })

  const [files, setFiles] = useState([])
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
        } else throw Error(Strings.boardsNotLoaded[lang])
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
      .then(response => response.json())
      .then(data => {
        setLoading(false)
        if (!data.error) {
          close()
          history.push('/thread/' + data._id)
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => {
        setLoading(false)
        setErrors({ general: err.message })
      })
  }

  const editThread = (method) => {
    const formData = new FormData()
    files.map(item => formData.append('attach', item))
    formData.append('postData', JSON.stringify({
      threadId: postType.id,
      title: values.title.substring(0, 100),
      body: values.body.substring(0, 1000)
    }))

    fetch(BACKEND + '/api/thread/' + method, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token
      },
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        setLoading(false)
        if (!data.error) {
          close()
          setPostType({
            type: 'answer',
            id: postType.id
          })
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => {
        setLoading(false)
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
      .then(response => response.json())
      .then(data => {
        setLoading(false)
        if (!data.error) {
          close()
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => {
        setLoading(false)
        setErrors({ general: err.message })
      })
  }

  const editAnswer = () => {
    const formData = new FormData()
    files.map(item => formData.append('attach', item))
    formData.append('postData', JSON.stringify({
      answerId: postType?.someData?.id || '',
      body: values.body.substring(0, 1000)
    }))

    fetch(BACKEND + '/api/answer/edit', {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token
      },
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        setLoading(false)
        if (!data.error) {
          close()
          setPostType({
            type: 'answer',
            id: postType.id
          })
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => {
        setLoading(false)
        setErrors({ general: err.message })
      })
  }

  const [date, setDate] = useState(new Date())

  const banCallback = () => {
    setErrors({})

    if (postType.type === 'ban') {
      if (!banValues.reason.trim()) {
        return setErrors({ reason: Strings.enterReason[lang] })
      }
      if (!date) {
        return setErrors({ expiresAt: Strings.enterDate[lang] })
      }

      setLoading(true)
      ban()
    }
  }

  const { onChange: banChange, onSubmit: banSubmit, values: banValues } = useForm(banCallback, {
    userId: postType.id,
    reason: '',
    body: postType?.someData?.body || ''
  })

  const ban = () => {
    fetch(`${BACKEND}/api/ban/create`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...banValues, expiresAt: date.toISOString() })
    })
      .then(response => response.json())
      .then(data => {
        setLoading(false)
        if (!data.error) {
          close()
          setPostType({
            type: 'answer',
            id: postType.id
          })
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => {
        setLoading(false)
        setErrors({ general: err.message })
      })
  }

  const [folders, setFolders] = useState([])

  const loadFolders = () => {
    if (folders.length) return

    fetch(`${BACKEND}/api/folders?pagination=${pagination}`)
      .then(response => response.json())
      .then(data => {
        if (data.docs?.length) {
          setFolders(data.docs)
        } else throw Error(Strings.foldersNotLoaded[lang])
      })
      .catch(err => {
        setErrors({ general: err.message })
      })
  }

  const uploadCallback = () => {
    setErrors({})

    if (postType.type === 'upload') {
      if (!fileValues.title.trim()) {
        return setErrors({ title: Strings.enterTitle[lang] })
      }
      if (!fileValues.body.trim()) {
        return setErrors({ body: Strings.enterContent[lang] })
      }
      if (!fileValues.folderId) {
        return setErrors({ folderId: Strings.chooseFromList[lang] })
      }

      setLoading(true)
      createFile()
    }

    if (postType.type === 'fileEdit') {
      if (!fileValues.title.trim()) {
        return setErrors({ title: Strings.enterTitle[lang] })
      }
      if (!fileValues.body.trim()) {
        return setErrors({ body: Strings.enterContent[lang] })
      }

      setLoading(true)
      editFile()
    }
  }

  const { onChange: fileChange, onSubmit: uploadSubmit, values: fileValues } = useForm(uploadCallback, {
    folderId: postType.id,
    title: postType?.someData?.title || '',
    body: postType?.someData?.body || ''
  })

  const createFile = () => {
    const formData = new FormData()
    files.map(item => formData.append('file', item))
    formData.append('postData', JSON.stringify({
      folderId: fileValues.folderId,
      title: fileValues.title.substring(0, 100),
      body: fileValues.body.substring(0, 1000)
    }))

    fetch(`${BACKEND}/api/file/create`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token
      },
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        setLoading(false)
        if (!data.error) {
          close()
          history.push('/file/' + data._id)
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => {
        setLoading(false)
        setErrors({ general: err.message })
      })
  }

  const editFile = () => {
    fetch(`${BACKEND}/api/file/edit`, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileId: fileValues.folderId,
        title: fileValues.title,
        body: fileValues.body
      })
    })
      .then(response => response.json())
      .then(data => {
        setLoading(false)
        if (!data.error) {
          close()
          setPostType({
            type: 'upload',
            id: null
          })
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => {
        setLoading(false)
        setErrors({ general: err.message })
      })
  }

  const threadContent = (
    <ModalBody title={Strings.newThread[lang]} onClick={close}>
      <form className="form_inner" onSubmit={onSubmit}>
        <FormCardItem title={Strings.threadTitle[lang]} error={errors.title}>
          <div className={errors.title ? 'form_block error' : 'form_block' }>
            <Input
              name="title"
              value={values.title}
              placeholder={Strings.enterTitle[lang]}
              maxLength="100"
              onChange={onChange}
            />
          </div>
        </FormCardItem>

        <FormCardItem title={Strings.content[lang]} error={errors.body}>
          <TextareaForm
            className={errors.body ? 'form_block error' : 'form_block' }
            name="body"
            value={values.body}
            placeholder={Strings.enterContent[lang]}
            onChange={onChange}
          />
        </FormCardItem>

        <FileUploadForm
          sendFiles={getFile}
          clearFiles={clearFiles}
        />

        <FormCardItem title={Strings.chooseABoard[lang]} error={errors.boardId}>
          <div className={errors.boardId ? 'form_block select error' : 'form_block select' }>
            <select
              className="input_area select_area"
              name="boardId"
              value={values.boardId}
              onChange={onChange}
              onClick={loadBoards}
            >
              <option value="">{Strings.select[lang]}</option>
              {boards.length ? (
                boards.map(item => (
                  <option key={item._id} value={item._id}>{item.title}</option>
                ))
              ) : (
                <option value="">{Strings.loading[lang]}...</option>
              )}
            </select>
          </div>
        </FormCardItem>

        {errors.general && (
          <div className="card_item">
            <span className="form_error">{errors.general}</span>
          </div>
        )}

        <div className="card_item">
          {loading
            ? <Loader className="btn" />
            : <InputButton text={Strings.createThread[lang]} />
          }
        </div>
      </form>
    </ModalBody>
  )

  const answerContent = (
    <ModalBody title={Strings.answerInThread[lang]} onClick={close}>
      <form className="form_inner" onSubmit={onSubmit}>
        <FormCardItem title={Strings.content[lang]} error={errors.body}>
          <TextareaForm
            className={errors.body ? 'form_block error' : 'form_block' }
            name="body"
            value={values.body}
            placeholder={Strings.enterContent[lang]}
            onChange={onChange}
          />
        </FormCardItem>

        <FileUploadForm
          sendFiles={getFile}
          clearFiles={clearFiles}
        />

        {errors.general && (
          <div className="card_item">
            <span className="form_error">{errors.general}</span>
          </div>
        )}

        <div className="card_item">
          {loading
            ? <Loader className="btn" />
            : <InputButton text={Strings.answer[lang]} />
          }
        </div>
      </form>
    </ModalBody>
  )

  const editAnswerContent = (
    <ModalBody title={Strings.editAnswer[lang]} onClick={close}>
      <form className="form_inner" onSubmit={onSubmit}>
        <FormCardItem title={Strings.content[lang]} error={errors.body}>
          <TextareaForm
            className={errors.body ? 'form_block error' : 'form_block' }
            name="body"
            value={values.body}
            placeholder={Strings.enterContent[lang]}
            onChange={onChange}
          />
        </FormCardItem>

        <FileUploadForm
          sendFiles={getFile}
          clearFiles={clearFiles}
        />

        {errors.general && (
          <div className="card_item">
            <span className="form_error">{errors.general}</span>
          </div>
        )}

        <div className="card_item">
          {loading
            ? <Loader className="btn" />
            : <InputButton text={Strings.edit[lang]} />
          }
        </div>
      </form>
    </ModalBody>
  )

  const editThreadContent = (
    <ModalBody title={Strings.editThread[lang]} onClick={close}>
      <form className="form_inner" onSubmit={onSubmit}>
        <FormCardItem title={Strings.threadTitle[lang]} error={errors.title}>
          <div className={errors.title ? 'form_block error' : 'form_block' }>
            <Input
              name="title"
              value={values.title}
              placeholder={Strings.enterTitle[lang]}
              maxLength="100"
              onChange={onChange}
            />
          </div>
        </FormCardItem>

        <FormCardItem title={Strings.content[lang]} error={errors.body}>
          <TextareaForm
            className={errors.body ? 'form_block error' : 'form_block' }
            name="body"
            value={values.body}
            placeholder={Strings.enterContent[lang]}
            onChange={onChange}
          />
        </FormCardItem>

        <FileUploadForm
          sendFiles={getFile}
          clearFiles={clearFiles}
        />

        {errors.general && (
          <div className="card_item">
            <span className="form_error">{errors.general}</span>
          </div>
        )}

        <div className="card_item">
          {loading
            ? <Loader className="btn" />
            : <InputButton text={Strings.edit[lang]} />
          }
        </div>
      </form>
    </ModalBody>
  )

  const banContent = (
    <ModalBody title={Strings.banUser[lang]} onClick={close}>
      <form className="form_inner" onSubmit={banSubmit}>
        <FormCardItem title={Strings.reason[lang]} error={errors.reason}>
          <div className={errors.reason ? 'form_block error' : 'form_block' }>
            <Input
              name="reason"
              value={banValues.reason}
              placeholder={Strings.enterReason[lang]}
              maxLength="100"
              onChange={banChange}
            />
          </div>
        </FormCardItem>

        <FormCardItem title={Strings.content[lang]} error={errors.body}>
          <TextareaForm
            className={errors.body ? 'form_block error' : 'form_block' }
            name="body"
            value={banValues.body}
            onChange={banChange}
            panel={false}
          />
        </FormCardItem>

        <FormCardItem title={Strings.banDuration[lang]} error={errors.expiresAt}>
          <div className={errors.expiresAt ? 'form_block error' : 'form_block' }>
            <DatePicker
              className="input_area"
              selected={date}
              minDate={date}
              showTimeSelect
              dateFormat="MMM d, yyyy h:mm aa"
              timeFormat="HH:mm"
              onChange={date => setDate(date)}
            />
          </div>
        </FormCardItem>

        {errors.general && (
          <div className="card_item">
            <span className="form_error">{errors.general}</span>
          </div>
        )}

        <div className="card_item">
          {loading
            ? <Loader className="btn" />
            : <InputButton text={Strings.ban[lang]} />
          }
        </div>
      </form>
    </ModalBody>
  )

  const uploadContent = (
    <ModalBody title={Strings.newFile[lang]} onClick={close}>
      <form className="form_inner" onSubmit={uploadSubmit}>
        <FormCardItem title={Strings.fileTitle[lang]} error={errors.title}>
          <div className={errors.title ? 'form_block error' : 'form_block' }>
            <Input
              name="title"
              value={fileValues.title}
              placeholder={Strings.enterTitle[lang]}
              maxLength="100"
              onChange={fileChange}
            />
          </div>
        </FormCardItem>

        <FormCardItem title={Strings.content[lang]} error={errors.body}>
          <TextareaForm
            className={errors.body ? 'form_block error' : 'form_block' }
            name="body"
            value={fileValues.body}
            placeholder={Strings.enterContent[lang]}
            onChange={fileChange}
          />
        </FormCardItem>

        <FileUploadForm
          title={Strings.yourFile[lang]}
          hint={`${Strings.maxFilesCount[lang]}: 1; ${Strings.maxSize[lang]}: 80 Mb`}
          multiple={false}
          sendFiles={getFile}
          clearFiles={clearFiles}
        />

        <FormCardItem title={Strings.chooseAFolder[lang]} error={errors.folderId}>
          <div className={errors.folderId ? 'form_block select error' : 'form_block select' }>
            <select
              className="input_area select_area"
              name="folderId"
              value={fileValues.folderId}
              onChange={fileChange}
              onClick={loadFolders}
            >
              <option value="">{Strings.select[lang]}</option>
              {folders.length ? (
                folders.map(item => (
                  <option key={item._id} value={item._id}>{item.title}</option>
                ))
              ) : (
                <option value="">{Strings.loading[lang]}...</option>
              )}
            </select>
          </div>
        </FormCardItem>

        {errors.general && (
          <div className="card_item">
            <span className="form_error">{errors.general}</span>
          </div>
        )}

        <div className="card_item">
          {loading
            ? <Loader className="btn" />
            : <InputButton text={Strings.uploadFile[lang]} />
          }
        </div>
      </form>
    </ModalBody>
  )

  const editFileContent = (
    <ModalBody title={Strings.editFile[lang]} onClick={close}>
      <form className="form_inner" onSubmit={uploadSubmit}>
        <FormCardItem title={Strings.fileTitle[lang]} error={errors.title}>
          <div className={errors.title ? 'form_block error' : 'form_block' }>
            <Input
              name="title"
              value={fileValues.title}
              placeholder={Strings.enterTitle[lang]}
              maxLength="100"
              onChange={fileChange}
            />
          </div>
        </FormCardItem>

        <FormCardItem title={Strings.content[lang]} error={errors.body}>
          <TextareaForm
            className={errors.body ? 'form_block error' : 'form_block' }
            name="body"
            value={fileValues.body}
            placeholder={Strings.enterContent[lang]}
            onChange={fileChange}
          />
        </FormCardItem>

        {errors.general && (
          <div className="card_item">
            <span className="form_error">{errors.general}</span>
          </div>
        )}

        <div className="card_item">
          {loading
            ? <Loader className="btn" />
            : <InputButton text={Strings.edit[lang]} />
          }
        </div>
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
  if (postType.type === 'ban') {
    modalContent = banContent
  }
  if (postType.type === 'upload') {
    modalContent = uploadContent
  }
  if (postType.type === 'fileEdit') {
    modalContent = editFileContent
  }

  return (
    <section className={modalOpen}>
      {modalContent}
    </section>
  )
}

export default Modal;

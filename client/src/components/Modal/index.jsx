import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { StoreContext } from 'store/Store';
import { useForm } from 'hooks/useForm';

import ModalBody from './ModalBody';
import FormCardItem from 'components/Card/FormCardItem';
import Input from 'components/Form/Input';
import TextareaForm from 'components/Form/TextareaForm';
import FileUploadForm from 'components/Form/FileUploadForm';
import { InputButton } from 'components/Button';
import Loader from 'components/Loader';

const Modal = ({ open, close }) => {
  const history = useHistory()
  const { postType, setPostType } = useContext(StoreContext)
  const modalOpen = open ? 'modal open' : 'modal'
  const [error, setError] = useState('')
  const loading = false

  const formCallback = () => {
    if (postType.type === 'answer') {
      createAnswer()
    }
    if (postType.type === 'thread') {
      if (!values.boardId || !values.title || !values.body) {
        setError('Fill all fields')
      } else {
        createThread()
        setError('')
      }
    }
    if (postType.type === 'answerEdit') {
      editAnswer()
    }
    if (postType.type === 'userThreadEdit') {
      editThread()
    }
    if (postType.type === 'adminThreadEdit') {
      adminEditThread()
    }
  }

  const { onChange, onSubmit, values } = useForm(formCallback, {
    boardId: postType.id || '',
    title: postType?.someData?.title || '',
    body: postType?.someData?.body || ''
  })

  const [boardsList] = useState([])

  const boards = () => {
    console.log(1)
    return
  }

  const createThread = () => {
    console.log(2)
    return
  }

  const createAnswer = () => {
    console.log(3)
    return
  }

  const editThread = () => {
    console.log(4)
    return
  }

  const adminEditThread = () => {
    console.log(5)
    return
  }

  const editAnswer = () => {
    console.log(6)
    return
  }

  const threadContent = (
    <ModalBody title="New thread" onClick={close}>
      <form className="form_inner" onSubmit={onSubmit}>
        <FormCardItem title="Thread title">
          <div className="form_block">
            <Input
              name="title"
              value={values.title}
              placeholder="Enter title"
              required
              maxLength="100"
              onChange={onChange}
            />
          </div>
        </FormCardItem>

        <FormCardItem title="Content">
          <TextareaForm
            name="body"
            value={values.body}
            placeholder="Enter your message"
            onChange={onChange}
            required
          />
        </FormCardItem>

        <FileUploadForm />

        <FormCardItem title="Choose board">
          <div className="form_block select">
            <select
              className="input_area select_area"
              name="boardId"
              value={values.boardId}
              onChange={onChange}
              required
            >
              <option>Select a board</option>
              {boardsList.length ? (
                boardsList.map(item => (
                  <option key={item.id} value={item.id}>{item.title}</option>
                ))
              ) : (
                <option>Loading...</option>
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

        {error && (
          <div className="card_item">
            <span className="form_error">{error}</span>
          </div>
        )}
      </form>
    </ModalBody>
  )

  const answerContent = (
    <ModalBody title="Answer in thread" onClick={close}>
      <form className="form_inner" onSubmit={onSubmit}>
        <FormCardItem title="Content">
          <TextareaForm
            name="body"
            value={values.body}
            placeholder="Enter your message"
            onChange={onChange}
            required
          />
        </FormCardItem>

        <FileUploadForm />

        <div className="card_item">
          {loading
            ? <Loader className="btn" />
            : <InputButton text="Answer" />
          }
        </div>
      </form>
    </ModalBody>
  )

  const editAnswerContent = (
    <ModalBody title="Edit answer" onClick={close}>
      <form className="form_inner" onSubmit={onSubmit}>
        <FormCardItem title="Content">
          <TextareaForm
            name="body"
            value={values.body}
            placeholder="Enter your message"
            onChange={onChange}
            required
          />
        </FormCardItem>

        <FileUploadForm />

        <div className="card_item">
          {loading
            ? <Loader className="btn" />
            : <InputButton text="Edit" />
          }
        </div>
      </form>
    </ModalBody>
  )

  const editThreadContent = (
    <ModalBody title="Edit thread" onClick={close}>
      <form className="form_inner" onSubmit={onSubmit}>
        <FormCardItem title="Thread title">
          <div className="form_block">
            <Input
              name="title"
              value={values.title}
              placeholder="Enter title"
              required
              maxLength="100"
              onChange={onChange}
            />
          </div>
        </FormCardItem>

        <FormCardItem title="Content">
          <TextareaForm
            name="body"
            value={values.body}
            placeholder="Enter your message"
            onChange={onChange}
            required
          />
        </FormCardItem>

        <FileUploadForm />

        <div className="card_item">
          {loading
            ? <Loader className="btn" />
            : <InputButton text="Edit" />
          }
        </div>
      </form>
    </ModalBody>
  )

  let modalContent
  if (postType.type === 'thread') {
    modalContent = threadContent
  }
  if (postType.type === 'answer') {
    modalContent = answerContent
  }
  if (postType.type === 'answerEdit') {
    modalContent = editAnswerContent
  }
  if (postType.type === 'userThreadEdit' || postType.type === 'adminThreadEdit') {
    modalContent = editThreadContent
  }

  return (
    <section className={modalOpen}>
      {modalContent}
    </section>
  )
}

export default Modal;

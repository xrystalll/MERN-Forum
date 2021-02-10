import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';

import { StoreContext } from 'store/Store';
import { useForm } from 'hooks/useForm';

import ModalBody from './ModalBody';
import FormCardItem from 'components/Card/FormCardItem';
import Input from 'components/Form/Input';
import { InputButton } from 'components/Button';
import Loader from 'components/Loader';

import {
  BOARDS_QUERY,
  THREADS_QUERY,
  THREAD_ANSWERS_QUERY,
  BOARDS_AND_RECENTLY_THREADS_QUERY
} from 'support/Queries';
import {
  CREATE_THREAD,
  CREATE_ANSWER,
  ADMIN_EDIT_THREAD,
  USER_EDIT_THREAD,
  EDIT_ANSWER
} from 'support/Mutations';

const Modal = ({ open, close }) => {
  const history = useHistory()
  const { postType, setPostType } = useContext(StoreContext)
  const modalOpen = open ? 'modal open' : 'modal'
  const [error, setError] = useState('')

  const createCallback = () => {
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

  const { onChange, onSubmit, values } = useForm(createCallback, {
    boardId: postType.id || '',
    title: postType?.someData?.title || '',
    body: postType?.someData?.body || ''
  })

  const [createAnswer, { loadingAnswer }] = useMutation(CREATE_ANSWER, {
    update(_, { data: { createAnswer } }) {
      close()
    },
    onError(err) {
      console.error(err)
    },
    refetchQueries: [{
      query: THREAD_ANSWERS_QUERY,
      variables: { id: postType.id }
    }, {
      query: BOARDS_QUERY
    }],
    variables: {
      threadId: postType.id,
      body: values.body
    }
  })

  const [createThread, { loadingThread }] = useMutation(CREATE_THREAD, {
    update(_, { data: { createThread } }) {
      close()
      history.push('/thread/' + createThread.id)
    },
    onError(err) {
      console.error(err)
    },
    refetchQueries: [{
      query: THREADS_QUERY,
      variables: { boardId: values.boardId }
    }, {
      query: BOARDS_AND_RECENTLY_THREADS_QUERY,
      variables: { limit: 5 }
    }, {
      query: BOARDS_QUERY
    }],
    variables: {
      boardId: values.boardId,
      title: values.title,
      body: values.body
    }
  })

  const [editAnswer, { loadingEditAnswer }] = useMutation(EDIT_ANSWER, {
    update(_, { data: { editAnswer } }) {
      close()
      setPostType({
        type: 'answer',
        id: postType.id
      })
    },
    onError(err) {
      console.error(err)
    },
    refetchQueries: [{
      query: THREAD_ANSWERS_QUERY,
      variables: { id: postType.id }
    }, {
      query: BOARDS_QUERY
    }],
    variables: {
      id: postType?.someData?.id || '',
      body: values.body
    }
  })

  const [editThread] = useMutation(USER_EDIT_THREAD, {
    update(_, { data: { editThread } }) {
      close()
      setPostType({
        type: 'answer',
        id: postType.id
      })
    },
    onError(err) {
      console.error(err)
    },
    refetchQueries: [{
      query: THREAD_ANSWERS_QUERY,
      variables: { id: postType.id }
    }, {
      query: BOARDS_AND_RECENTLY_THREADS_QUERY,
      variables: { limit: 5 }
    }, {
      query: BOARDS_QUERY
    }],
    variables: {
      id: postType.id,
      title: values.title,
      body: values.body
    }
  })

  const [adminEditThread] = useMutation(ADMIN_EDIT_THREAD, {
    update(_, { data: { adminEditThread } }) {
      close()
      setPostType({
        type: 'answer',
        id: postType.id
      })
    },
    onError(err) {
      console.error(err)
    },
    refetchQueries: [{
      query: THREAD_ANSWERS_QUERY,
      variables: { id: postType.id }
    }, {
      query: BOARDS_AND_RECENTLY_THREADS_QUERY,
      variables: { limit: 5 }
    }, {
      query: BOARDS_QUERY
    }],
    variables: {
      id: postType.id,
      title: values.title,
      body: values.body
    }
  })

  const { loading: loadingBoards, data: boardsData } = useQuery(BOARDS_QUERY)

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
              onChange={onChange}
            />
          </div>
        </FormCardItem>

        <FormCardItem title="Content">
          <div className="form_block">
            <div className="form_foot">
              <div className="act_group">
                <div className="bb_btn" role="button">
                  <i className="bx bx-italic"></i>
                </div>
                <div className="bb_btn" role="button">
                  <i className="bx bx-bold"></i>
                </div>
                <div className="bb_btn" role="button">
                  <i className="bx bx-link"></i>
                </div>
                <div className="bb_btn" role="button">
                  <i className="bx bx-hide"></i>
                </div>
                <div className="bb_btn" role="button">
                  <i className="bx bx-image-alt"></i>
                </div>
                <div className="bb_btn" role="button">
                  <i className="bx bx-code-alt"></i>
                </div>
              </div>
            </div>

            <div className="text_area">
              <textarea
                name="body"
                value={values.body}
                placeholder="Enter your message"
                onChange={onChange}
                required
              />
            </div>
          </div>
        </FormCardItem>

        <div className="card_item">
          <div className="attached_file card_left empty">
            <span className="remove_file">
              <i className="bx bx-x"></i>
            </span>
          </div>

          <div className="card_body file_input_body">
            <div className="card_outside_title with_hint">
              Attach file
              <div className="title_hint">
                <i className="bx bx-help-circle"></i>
                <div className="hint_popover">Allowed: png, jpg, jpeg, gif, zip, rar, txt. Max size: 10Mb</div>
              </div>
            </div>

            <div className="form_block">
              <div className="file_area">
                <input id="fileInput" type="file" />
                <label htmlFor="fileInput" className="file_input" title="Choose file">
                  <div className="secondary_btn">Choose</div>
                  <span>File not selected</span>
                </label>
              </div>
            </div>
          </div>
        </div>

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
              {loadingBoards ? (
                <option>Loading...</option>
              ) : (
                boardsData && (
                  boardsData.getBoards.map(item => (
                    <option key={item.id} value={item.id}>{item.title}</option>
                  ))
                )
              )}
            </select>
          </div>
        </FormCardItem>

        <div className="card_item">
          {loadingThread
            ? <Loader className="btn" />
            : <InputButton text="Create thread" />}
        </div>

        {error && <span className="form_error">{error}</span>}
      </form>
    </ModalBody>
  )

  const answerContent = (
    <ModalBody title="Answer in thread" onClick={close}>
      <form className="form_inner" onSubmit={onSubmit}>
        <FormCardItem title="Content">
          <div className="form_block">
            <div className="form_foot">
              <div className="act_group">
                <div className="bb_btn" role="button">
                  <i className="bx bx-italic"></i>
                </div>
                <div className="bb_btn" role="button">
                  <i className="bx bx-bold"></i>
                </div>
                <div className="bb_btn" role="button">
                  <i className="bx bx-link"></i>
                </div>
                <div className="bb_btn" role="button">
                  <i className="bx bx-hide"></i>
                </div>
                <div className="bb_btn" role="button">
                  <i className="bx bx-image-alt"></i>
                </div>
                <div className="bb_btn" role="button">
                  <i className="bx bx-code-alt"></i>
                </div>
              </div>
            </div>

            <div className="text_area">
              <textarea
                name="body"
                value={values.body}
                placeholder="Enter your message"
                onChange={onChange}
                required
              />
            </div>
          </div>
        </FormCardItem>

        <div className="card_item">
          <div id="attached" className="attached_file card_left empty">
            <span className="remove_file">
              <i className="bx bx-x"></i>
            </span>
          </div>

          <div className="card_body file_input_body">
            <div className="card_outside_title with_hint">
              Attach file
              <div className="title_hint">
                <i className="bx bx-help-circle"></i>
                <div className="hint_popover">Allowed: png, jpg, jpeg, gif, zip, rar, txt. Max size: 10Mb</div>
              </div>
            </div>

            <div className="form_block">
              <div className="file_area">
                <input id="fileInput" type="file" />
                <label htmlFor="fileInput" className="file_input" title="Choose file">
                  <div className="secondary_btn">Choose</div>
                  <span>File not selected</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="card_item">
          {loadingAnswer
            ? <Loader className="btn" />
            : <InputButton text="Answer" />}
        </div>
      </form>
    </ModalBody>
  )

  const editAnswerContent = (
    <ModalBody title="Edit answer" onClick={close}>
      <form className="form_inner" onSubmit={onSubmit}>
        <FormCardItem title="Content">
          <div className="form_block">
            <div className="form_foot">
              <div className="act_group">
                <div className="bb_btn" role="button">
                  <i className="bx bx-italic"></i>
                </div>
                <div className="bb_btn" role="button">
                  <i className="bx bx-bold"></i>
                </div>
                <div className="bb_btn" role="button">
                  <i className="bx bx-link"></i>
                </div>
                <div className="bb_btn" role="button">
                  <i className="bx bx-hide"></i>
                </div>
                <div className="bb_btn" role="button">
                  <i className="bx bx-image-alt"></i>
                </div>
                <div className="bb_btn" role="button">
                  <i className="bx bx-code-alt"></i>
                </div>
              </div>
            </div>

            <div className="text_area">
              <textarea
                name="body"
                value={values.body}
                placeholder="Enter your message"
                onChange={onChange}
                required
              />
            </div>
          </div>
        </FormCardItem>

        <div className="card_item">
          <div id="attached" className="attached_file card_left empty">
            <span className="remove_file">
              <i className="bx bx-x"></i>
            </span>
          </div>

          <div className="card_body file_input_body">
            <div className="card_outside_title with_hint">
              Attach file
              <div className="title_hint">
                <i className="bx bx-help-circle"></i>
                <div className="hint_popover">Allowed: png, jpg, jpeg, gif, zip, rar, txt. Max size: 10Mb</div>
              </div>
            </div>

            <div className="form_block">
              <div className="file_area">
                <input id="fileInput" type="file" />
                <label htmlFor="fileInput" className="file_input" title="Choose file">
                  <div className="secondary_btn">Choose</div>
                  <span>File not selected</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="card_item">
          {loadingEditAnswer
            ? <Loader className="btn" />
            : <InputButton text="Edit" />}
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
              onChange={onChange}
            />
          </div>
        </FormCardItem>

        <FormCardItem title="Content">
          <div className="form_block">
            <div className="form_foot">
              <div className="act_group">
                <div className="bb_btn" role="button">
                  <i className="bx bx-italic"></i>
                </div>
                <div className="bb_btn" role="button">
                  <i className="bx bx-bold"></i>
                </div>
                <div className="bb_btn" role="button">
                  <i className="bx bx-link"></i>
                </div>
                <div className="bb_btn" role="button">
                  <i className="bx bx-hide"></i>
                </div>
                <div className="bb_btn" role="button">
                  <i className="bx bx-image-alt"></i>
                </div>
                <div className="bb_btn" role="button">
                  <i className="bx bx-code-alt"></i>
                </div>
              </div>
            </div>

            <div className="text_area">
              <textarea
                name="body"
                value={values.body}
                placeholder="Enter your message"
                onChange={onChange}
                required
              />
            </div>
          </div>
        </FormCardItem>

        <div className="card_item">
          <div id="attached" className="attached_file card_left empty">
            <span className="remove_file">
              <i className="bx bx-x"></i>
            </span>
          </div>

          <div className="card_body file_input_body">
            <div className="card_outside_title with_hint">
              Attach file
              <div className="title_hint">
                <i className="bx bx-help-circle"></i>
                <div className="hint_popover">Allowed: png, jpg, jpeg, gif, zip, rar, txt. Max size: 10Mb</div>
              </div>
            </div>

            <div className="form_block">
              <div className="file_area">
                <input id="fileInput" type="file" />
                <label htmlFor="fileInput" className="file_input" title="Choose file">
                  <div className="secondary_btn">Choose</div>
                  <span>File not selected</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="card_item">
          <InputButton text="Edit" />
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

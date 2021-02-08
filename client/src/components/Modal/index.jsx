import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';

import { StoreContext } from 'store/Store';
import { useForm } from 'hooks/useForm';

import Loader from 'components/Loader';

const BOARDS_QUERY = gql`
  {
    getBoards {
      id
      title
    }
  }
`;

const CREATE_THREAD = gql`
  mutation($boardId: ID!, $title: String!, $body: String!) {
    createThread(boardId: $boardId, title: $title, body: $body) {
      id
    }
  }
`;

const CREATE_ANSWER = gql`
  mutation($threadId: ID!, $body: String!) {
    createAnswer(threadId: $threadId, body: $body) {
      threadId
    }
  }
`;

const Modal = ({ open, close }) => {
  const history = useHistory()
  const { postType } = useContext(StoreContext)
  const modalOpen = open ? 'modal open' : 'modal'

  const createCallback = () => {
    postType.type === 'answer' ? createAnswer() : createThread()
  }

  const { onChange, onSubmit, values } = useForm(createCallback, {
    boardId: '',
    title: '',
    body: ''
  })

  const [createAnswer, { loadingAnswer }] = useMutation(CREATE_ANSWER, {
    update(_, { data: { createAnswer } }) {
      close()
      history.push('/thread/' + createAnswer.threadId)
    },
    onError(err) {
      console.error(err)
    },
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
    variables: {
      boardId: postType.id || values.boardId,
      title: values.title,
      body: values.body
    }
  })

  const { loading: loadingBoards, data: boardsData } = useQuery(BOARDS_QUERY)

  return (
    <section className={modalOpen}>
      {postType.type === 'answer' ? (
        <div className="modal_body">
          <div className="modal_head">
            <div className="section_header with_link">
              <h2>Answer in thread</h2>
              <div className="modal_close more_link" onClick={close}>
                <i className="bx bx-x"></i>
              </div>
            </div>
          </div>
          <form className="form_inner" onSubmit={onSubmit}>
            <div className="card_item">
              <div className="card_body">
                <div className="card_outside_title">Content</div>

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
              </div>
            </div>

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
                : <input className="btn" type="submit" value="Answer" />}
            </div>
          </form>
        </div>
      ) : (
        <div className="modal_body">
          <div className="modal_head">
            <div className="section_header with_link">
              <h2>New thread</h2>
              <div className="modal_close more_link" onClick={close}>
                <i className="bx bx-x"></i>
              </div>
            </div>
          </div>
          <form className="form_inner"  onSubmit={onSubmit}>
            <div className="card_item">
              <div className="card_body">
                <div className="card_outside_title">Thread title</div>

                <div className="form_block">
                  <input
                    className="input_area"
                    type="text"
                    name="title"
                    value={values.title}
                    placeholder="Enter title"
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="card_item">
              <div className="card_body">
                <div className="card_outside_title">Content</div>

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
              </div>
            </div>

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
              <div className="card_body">
                <div className="card_outside_title">Choose board</div>

                <div className="form_block select">

                  <select
                    className="input_area select_area"
                    name="boardId"
                    value={values.boardId}
                    onChange={onChange}
                    required
                  >
                    {loadingBoards ? (
                      <option defaultValue>Loading...</option>
                    ) : (
                      boardsData.getBoards.map(item => (
                        <option key={item.id} value={item.id}>{item.title}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </div>

            <div className="card_item">
              {loadingThread
                ? <Loader className="btn" />
                : <input className="btn" type="submit" value="Create thread" />}
            </div>
          </form>
        </div>
      )}
    </section>
  )
}

export default Modal;

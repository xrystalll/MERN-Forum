import { Fragment, useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { StoreContext } from 'store/Store';
import { counter, declOfNum, dateFormat } from 'support/Utils';

import Dropdown from './Dropdown';
import Markdown from 'components/Markdown';

import { BOARDS_AND_RECENTLY_THREADS_QUERY, THREADS_QUERY, THREAD_ANSWERS_QUERY } from 'support/Queries';
import {
  LIKE_THREAD_MUTATION,
  LIKE_ANSWER_MUTATION,
  DELETE_THREAD,
  DELETE_ANSWER,
  ADMIN_EDIT_THREAD
} from 'support/Mutations';

const Card = ({ data, threadData, full = false, type }) => {
  const { user, setModalOpen, setPostType, setFabVisible } = useContext(StoreContext)
  const history = useHistory()
  const [likes, setLikes] = useState(data.likeCount)
  const [liked, setLiked] = useState(user ? !!data?.likes?.find(i => i.username === user.username) : false)

  useEffect(() => { 
    if (type === 'thread' && data.closed) {
      setFabVisible(false)
    }
  }, [type, data.closed, setFabVisible])

  const imageTypes = ['jpg', 'jpeg', 'png', 'gif']

  const [likeThread] = useMutation(LIKE_THREAD_MUTATION, {
    variables: { id: data.id },
    update(_, { data: { likeThread } }) {
      setLikes(likeThread.likeCount)
    }
  })

  const [likeAnswer] = useMutation(LIKE_ANSWER_MUTATION, {
    variables: { id: data.id },
    update(_, { data: { likeAnswer } }) {
      setLikes(likeAnswer.likeCount)
    }
  })

  const onLike = () => {
    if (user) {
      setLiked(!liked)
      type === 'answer' ? likeAnswer() : likeThread()
    } else {
      history.push('/signup')
    }
  }

  const editClick = () => {
    const admin = user.role === 'admin' ? true : false
    let postType
    if (type === 'thread' && admin) {
      postType = 'adminThreadEdit'
    } else if (type === 'answer') {
      postType = 'answerEdit'
    } else {
      postType = 'userThreadEdit'
    }
    setPostType({
      type: postType,
      id: data.id,
      someData: {
        id: data.id,
        title: data.title,
        body: data.body
      }
    })
    setModalOpen(true)
  }

  const answerTo = (toId, username) => {
    let id
    if (type === 'answer') {
      id = data.threadId
    } else {
      id = data.id
    }
    setPostType({
      type: 'answer',
      id,
      someData: {
        toId,
        body: `**${username}**, `
      }
    })
    setModalOpen(true)
  }

  const [deleteThread] = useMutation(DELETE_THREAD, {
    refetchQueries: [{
      query: BOARDS_AND_RECENTLY_THREADS_QUERY,
      variables: { limit: 5 }
    }, {
      query: THREADS_QUERY,
      variables: { boardId: data.boardId }
    }],
    variables: { id: data.id }
  })

  const [deleteAnswer] = useMutation(DELETE_ANSWER, {
    refetchQueries: [{
      query: THREAD_ANSWERS_QUERY,
      variables: { id: data.threadId }
    }],
    variables: { id: data.id }
  })

  const onDelete = () => {
    if (type === 'answer') {
      deleteAnswer()
    } else {
      deleteThread()
      history.push('/')
    }
  }

  const [pined, setPined] = useState(data.pined)
  const [closed, setClosed] = useState(data.closed)

  const [adminEditThread] = useMutation(ADMIN_EDIT_THREAD)

  const onPin = () => {
    if (type !== 'answer') {
      setPined(!pined)
      adminEditThread({
        variables: {
          id: data.id,
          title: data.title,
          body: data.body,
          pined: !pined,
          closed
        }
      })
    }
  }

  const onClose = () => {
    if (type !== 'answer') {
      setClosed(!closed)
      setFabVisible(closed)
      adminEditThread({
        variables: {
          id: data.id,
          title: data.title,
          body: data.body,
          pined,
          closed: !closed
        }
      })
    }
  }

  return (
    <div className="card_item">
      <div className="card_body">
        <div className="card_block">
          <header className="card_head">
            <div className="card_head_inner">
              {full ? (
                data.title && (
                  <div className="card_title full">
                    {data.pined && <i className="thread_pin bx bx-pin"></i>}
                    {data.closed && <i className="thread_lock bx bx-lock-alt"></i>}
                    {data.title}
                  </div>
                )
              ) : (
                <Link to={'/thread/' + data.id} className="card_title">
                  {data.pined && <i className="thread_pin bx bx-pin"></i>}
                  {data.closed && <i className="thread_lock bx bx-lock-alt"></i>}
                  {data.title}
                </Link>
              )}

              <div className="card_info">
                <Link to={'/user/' + data.author.id} className="head_text bold">
                  {data.author.username}
                  {full && (
                    data.author.role === 'admin' ? (
                      <span className="user_status">admin</span>
                    ) : (
                      <Fragment>
                        {type === 'thread' && <span className="user_status">owner</span>}
                        {type === 'answer' && (
                          data.author.id === threadData.author.id && (
                            <span className="user_status">owner</span>
                          )
                        )}
                      </Fragment>
                    )
                  )}
                </Link>
                <span className="bullet">•</span>
                <span className="head_text">
                  <time>{dateFormat(data.createdAt)}</time>
                </span>
              </div>
            </div>

            {full && user && (
              <Dropdown>
                {user.role === 'admin' && (
                  <Fragment>
                    {type !== 'answer' && <div onClick={onPin} className="dropdown_item">Pin</div>}
                    {type !== 'answer' && <div onClick={onClose} className="dropdown_item">Close</div>}
                    <div onClick={onDelete} className="dropdown_item">Delete</div>
                  </Fragment>
                )}
                {user.id === data.author.id || user.role === 'admin'
                  ? <div onClick={editClick} className="dropdown_item">Edit</div>
                  : null
                }
              </Dropdown>
            )}
          </header>

          {full && (
            <div className="card_content markdown">
              <Markdown source={data.body} />

              {data.attach && (
                data.attach.map((item, index) => (
                  <Fragment key={index}>
                    {imageTypes.find(i => i === item.type) ? (
                      <div className="attached_file card_left" style={{ backgroundImage: `url(${item.file})` }}></div>
                    ) : (
                      <div className="attached_file card_left empty">
                        <div className="attached_info">{item.type}</div>
                      </div>
                    )}
                  </Fragment>
                ))
              )}
            </div>
          )}

          <footer className="card_foot">
            {full ? (
              <Fragment>
                {user && user.id !== data.author.id && (
                  <div className="act_btn foot_btn" onClick={() => answerTo(data.id, data.author.username)}>
                    <i className="bx bx-reply bx-flip-horizontal"></i>
                    <span>Answer</span>
                  </div>
                )}

                <div className="act_btn foot_btn likes" onClick={onLike}>
                  <i className={liked ? 'bx bx-heart liked' : 'bx bx-heart'}></i>
                  {likes > 0 && (
                    <Fragment>
                      <span className="card_count">{counter(likes)}</span>
                      <span className="hidden">{declOfNum(likes, ['like', 'likes', 'likes'])}</span>
                      {user && (
                        <div className="likes_list">
                          {data.likes.slice(0, 4).map((item, index) => (
                            <div key={index} className="head_profile" title={item.username} style={{ backgroundImage: `url(${item.picture})` }}>
                              {!item.picture && item.username.charAt(0)}
                            </div>
                          ))}
                          {data.likes.length > 4 && <span>4 and others</span>}
                        </div>
                      )}
                    </Fragment>
                  )}
                </div>

                {data.answersCount > 0 && (
                  <div className="act_btn foot_btn disable">
                    <i className="bx bx-message-square-detail"></i>
                    <span className="card_count">{counter(data.answersCount)}</span>
                    <span className="hidden">{declOfNum(data.answersCount, ['answer', 'answers', 'answers'])}</span>
                  </div>
                )}
              </Fragment>
            ) : (
              <div className="act_btn foot_btn disable">
                <i className="bx bx-message-square-detail"></i>
                <span className="card_count">{counter(data.answersCount)}</span>
                <span className="hidden">{declOfNum(data.answersCount, ['answer', 'answers', 'answers'])}</span>
              </div>
            )}
          </footer>

          {full && (
            data.edited.createdAt && (
              <div className="act_btn foot_btn under_foot disable">
                <i className="bx bx-pencil"></i>
                <span className="card_count">
                  {dateFormat(data.edited.createdAt)}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

const BoardCard = ({ data }) => {
  return (
    <div className="card_item">
      <div className="card_body">
        <div className="card_block">
          <header className="card_head">
            <div className="card_head_inner">
              <Link to={'/boards/' + data.id} className="card_title">{data.title}</Link>
            </div>
          </header>

          <footer className="card_foot">
            <div className="act_btn foot_btn disable">
              <i className="bx bx-news"></i>
              <span className="card_count">{counter(data.threadsCount)}</span>
              <span className="hidden">{declOfNum(data.threadsCount, ['thread', 'threads', 'threads'])}</span>
            </div>

            <div className="act_btn foot_btn disable">
              <i className="bx bx-message-square-detail"></i>
              <span className="card_count">{counter(data.answersCount)}</span>
              <span className="hidden">{declOfNum(data.answersCount, ['answer', 'answers', 'answers'])}</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

const UserCard = ({ data }) => {
  return (
    <div className="card_item">
      <div className="card_body">
        <div className="card_block">
          <Link to={'/user/' + data.id} className="card_head user_head">
            <div className="card_head_inner">
              <div className="card_title user_title">
                <div className="head_profile" style={{ backgroundImage: `url(${data.picture})` }}>
                  {!data.picture && data.username.charAt(0)}
                </div>
                <div className="user_info">
                  {data.username}
                  {data.role === 'admin' && <span className="user_status">admin</span>}
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export { Card, BoardCard, UserCard };

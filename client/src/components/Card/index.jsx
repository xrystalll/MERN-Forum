import { Fragment, useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import moment from 'moment';

import { StoreContext } from 'store/Store';
import { counter, declOfNum } from 'support/Utils';

const LIKE_THREAD_MUTATION = gql`
  mutation($id: ID!) {
    likeThread(id: $id) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

const LIKE_ANSWER_MUTATION = gql`
  mutation($id: ID!) {
    likeAnswer(id: $id) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

const Card = ({ data, full, type }) => {
  const { user } = useContext(StoreContext)
  const history = useHistory()
  const [likes, setLikes] = useState(data.likeCount)
  const [liked, setLiked] = useState(user ? !!data?.likes?.find(i => i.username === user.username) : false)

  const imageTypes = ['jpg', 'jpeg', 'png', 'gif']
  const imageFile = data?.attach?.length
    ? imageTypes.find(i => i === data.attach.type) ? { backgroundImage: `url(${data.attach.file})`} : null
    : null

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

  return (
    <div className="card_item">
      <div className="card_body">
        <div className="card_block">
          <header className="card_head">
            <div className="card_head_inner">
              {full ? (
                <div className="card_title full">
                  {data.pined && <i className="thread_pin bx bx-pin"></i>}
                  {data.closed && <i className="thread_lock bx bx-lock-alt"></i>}
                  {data.title}
                </div>
              ) : (
                <Link to={'/thread/' + data.id} className="card_title">
                  {data.pined && <i className="thread_pin bx bx-pin"></i>}
                  {data.closed && <i className="thread_lock bx bx-lock-alt"></i>}
                  {data.title}
                </Link>
              )}

              <div className="card_info">
                <Link to={'/user/' + data.author[0].id} className="head_text bold">{data.author[0].username}</Link>
                <span className="bullet">•</span>
                <span className="head_text">
                  <time>{moment(data.createdAt).calendar(null, { lastWeek: 'DD MMM, hh:mm', sameElse: 'DD MMM YY, hh:mm' })}</time>
                </span>
              </div>
            </div>

            <div className="dropdown">
              <div className="dropdown_trigger act_btn">
                <i className="bx bx-dots-horizontal-rounded"></i>
              </div>
              <div className="dropdown_content">
                <div className="dropdown_item">Report</div>
                <div className="dropdown_item">Copy link</div>
              </div>
            </div>
          </header>

          {full && (
            <div className="card_content">
              <p>{data.body}</p>

              {imageFile && (
                <div className="attached_file card_left empty visible" style={imageFile}>
                  <div className="attached_info">{data.attach.type}</div>
                </div>
              )}
            </div>
          )}

          <footer className="card_foot">
            {full ? (
              <Fragment>
                <div className="act_btn foot_btn">
                  <i className="bx bx-reply bx-flip-horizontal"></i>
                  <span>Answer</span>
                </div>

                <div className="act_btn foot_btn" onClick={onLike}>
                  <i className={liked ? 'bx bx-heart liked' : 'bx bx-heart'}></i>
                  {likes > 0 && (
                    <Fragment>
                      <span className="card_count">{counter(likes)}</span>
                      <span className="hidden">{declOfNum(likes, ['like', 'likes', 'likes'])}</span>
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
            data?.edited?.length ? (
              <div className="act_btn foot_btn under_foot disable">
                <i className="bx bx-pencil"></i>
                <span className="card_count">
                  {moment(data.edited[0].createdAt).calendar(null, { lastWeek: 'DD MMM, hh:mm', sameElse: 'DD MMM YY, hh:mm' })}
                </span>
              </div>
            ) : null
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

export { Card, BoardCard };

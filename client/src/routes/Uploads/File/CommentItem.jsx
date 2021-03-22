import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { StoreContext } from 'store/Store';

import { counter, declOfNum, dateFormat } from 'support/Utils';
import { BACKEND, Strings } from 'support/Constants';

import Markdown from 'components/Markdown';
import Dropdown from 'components/Card/Dropdown';
import UserRole from 'components/UserRole';

const CommentItem = ({ data, setCommentedTo }) => {
  const { user, token, setModalOpen, setPostType, setFabVisible, lang } = useContext(StoreContext)
  const history = useHistory()
  const likesList = useRef()
  const [likes, setLikes] = useState(data.likes)
  const [liked, setLiked] = useState(user ? !!data?.likes?.find(i => i._id === user.id) : false)

  const likeComment = () => {
    fetch(BACKEND + '/api/file/comment/like', {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ commentId: data._id })
    })
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          setLikes(data.likes)
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => toast.error(err.message))
  }

  useEffect(() => {
    setLikes(data.likes)
  }, [data.likes])

  const onLike = ({ target }) => {
    if (likesList.current?.contains(target)) return

    if (user) {
      setLiked(prev => !prev)
      likeComment()
    } else {
      history.push('/signup')
    }
  }

  const editClick = () => {
    return
  }

  const answerTo = (toId, displayName) => {
    setCommentedTo({ text: `**${displayName}**, `, id: toId })
  }

  const deleteComment = () => {
    fetch(BACKEND + '/api/file/comment/delete', {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ commentId: data._id })
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) throw Error(data.error?.message || 'Error')
      })
      .catch(err => toast.error(err.message))
  }

  const onDelete = () => {
    deleteComment()
  }

  const [banned, setBanned] = useState(data.author?.ban)

  const onBan = () => {
    if (banned) {
      fetch(BACKEND + '/api/ban/delete', {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: data.author._id })
      })
        .then(response => response.json())
        .then(data => {
          if (!data.error) {
            setBanned(false)
          } else throw Error(data.error?.message || 'Error')
        })
        .catch(err => toast.error(err.message))
    } else {
      setPostType({
        type: 'ban',
        id: data.author._id,
        someData: {
          body: data.body
        }
      })
      setModalOpen(true)
    }
  }

  return (
    <div className="card_item">
      <div className="card_body">
        <div className="card_block">
          <header className="card_head">
            <div className="card_head_inner">
              <div className="card_info">
                <Link to={'/user/' + data.author.name} className="head_text bold">
                  {data.author.displayName}

                  <Fragment>
                    {new Date() - new Date(data.author.onlineAt) < 5 * 60000 && <span className="online" title="online" />}
                    <UserRole role={data.author.role} />
                  </Fragment>
                </Link>
                <span className="bullet">-</span>
                <span className="head_text">
                  <time>{dateFormat(data.createdAt)}</time>
                </span>
              </div>
            </div>

            {user && (
              user.role >= 2 || user.id === data.author._id ? (
                <Dropdown>
                  {user.role >= 2 && (
                    <Fragment>
                      {user.id !== data.author._id && data.author.role === 1 && (
                        <div onClick={onBan} className="dropdown_item">
                          {banned ? Strings.unbanUser[lang] : Strings.banUser[lang]}
                        </div>
                      )}
                    </Fragment>
                  )}
                  {user.id === data.author._id || user.role >= 2
                    ? <div onClick={onDelete} className="dropdown_item">{Strings.delete[lang]}</div>
                    : null
                  }
                </Dropdown>
              ) : null
            )}
          </header>

          <div className="card_content markdown">
            <Markdown source={data.body} />
          </div>

          <footer className="card_foot">
            {user && user.id !== data.author._id && (
              <div className="act_btn foot_btn" onClick={() => answerTo(data._id, data.author.displayName)}>
                <i className="bx bx-redo" />
                <span>{Strings.answer[lang]}</span>
              </div>
            )}

            <div className="act_btn foot_btn likes" onClick={onLike}>
              <i className={liked ? 'bx bx-heart liked' : 'bx bx-heart'} />
              {likes.length ? (
                <Fragment>
                  <span className="card_count">{counter(likes.length)}</span>
                  <span className="hidden">
                    {declOfNum(likes.length, [Strings.like1[lang], Strings.like2[lang], Strings.like3[lang]])}
                  </span>
                  {user && (
                    <div className="likes_list" ref={likesList}>
                      {likes.slice(0, 4).map((item, index) => (
                        <Link
                          key={index}
                          to={'/user/' + item.name}
                          className="head_profile"
                          title={item.displayName}
                          style={{ backgroundImage: `url(${item.picture ? BACKEND + item.picture : ''})` }}
                        >
                          {!item.picture && item.displayName.charAt(0)}
                        </Link>
                      ))}
                      {likes.length > 4 && <span>and {likes.length - 4} more</span>}
                    </div>
                  )}
                </Fragment>
              ) : null}
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default CommentItem;

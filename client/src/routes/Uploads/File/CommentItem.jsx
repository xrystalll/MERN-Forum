import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { StoreContext } from 'store/Store';

import { counter, declOfNum, dateFormat, deletedUser } from 'support/Utils';
import { BACKEND, Strings } from 'support/Constants';

import Markdown from 'components/Markdown';
import { CardBody } from 'components/Card';
import Dropdown from 'components/Card/Dropdown';
import { UserRole, UserStatus, UserOnline } from 'components/UserBadge';

const CommentItem = ({ data, setCommentedTo }) => {
  const { user, token, setModalOpen, setPostType, lang } = useContext(StoreContext)
  const history = useHistory()
  const likesList = useRef()
  const [likes, setLikes] = useState(data.likes)
  const [liked, setLiked] = useState(user ? !!data?.likes?.find(i => i._id === user.id) : false)

  if (data.author === null) {
    data.author = deletedUser
  }

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
      .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
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
      .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
  }

  const onDelete = () => {
    const conf = window.confirm(`${Strings.delete[lang]}?`)

    if (!conf) return

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
        .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
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
    <CardBody>
      <header className="card_head">
        <div className="card_head_inner">
          <div className="card_info">
            <Link to={'/user/' + data.author.name} className="head_text bold">
              {data.author.displayName}

              <>
                <UserOnline onlineAt={data.author.onlineAt} dot />
                <UserRole role={data.author.role} />
                {data.author.ban && <UserStatus status="ban" />}
              </>
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
                <>
                  {data.author.name !== 'deleted' && user.id !== data.author._id && data.author.role === 1 && (
                    <div onClick={onBan} className="dropdown_item">
                      {banned ? Strings.unbanUser[lang] : Strings.banUser[lang]}
                    </div>
                  )}
                  {user.role >= data.author.role && (
                    <div onClick={onDelete} className="dropdown_item">{Strings.delete[lang]}</div>
                  )}
                </>
              )}
              {user.id === data.author._id && user.role === 1 && (
                <div onClick={onDelete} className="dropdown_item">{Strings.delete[lang]}</div>
              )}
            </Dropdown>
          ) : null
        )}
      </header>

      <div className="card_content markdown">
        <Markdown source={data.body} />
      </div>

      <footer className="card_foot">
        {data.author.name !== 'deleted' && user && user.id !== data.author._id && (
          <div className="act_btn foot_btn" onClick={() => answerTo(data._id, data.author.displayName)}>
            <i className="bx bx-redo" />
            <span>{Strings.answer[lang]}</span>
          </div>
        )}

        <div className="act_btn foot_btn relative" onClick={onLike}>
          <i className={liked ? 'bx bx-heart liked' : 'bx bx-heart'} />
          {likes.length ? (
            <>
              <span className="card_count">{counter(likes.length)}</span>
              <span className="hidden">
                {declOfNum(likes.length, [Strings.like1[lang], Strings.like2[lang], Strings.like3[lang]])}
              </span>
              {user && (
                <div className="pop_list" ref={likesList}>
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
                  {likes.length > 4 && <span>+{likes.length - 4}</span>}
                </div>
              )}
            </>
          ) : null}
        </div>
      </footer>
    </CardBody>
  )
}

export default CommentItem;

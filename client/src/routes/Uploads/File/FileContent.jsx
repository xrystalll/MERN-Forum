import { Fragment, useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Lightbox from 'react-image-lightbox';
import { toast } from 'react-toastify';

import { counter, declOfNum, dateFormat, formatBytes, deletedUser } from 'support/Utils';
import { BACKEND, Strings, imageTypes, videoTypes, fileExt } from 'support/Constants';

import Markdown from 'components/Markdown';
import Dropdown from 'components/Card/Dropdown';
import { Button } from 'components/Button';
import { UserRole, UserStatus } from 'components/UserBadge';

const FileContent = ({ data, user, token, lang, deleteFile, editFile }) => {
  const history = useHistory()
  const likesList = useRef()
  const [likes, setLikes] = useState(data.likes)
  const [liked, setLiked] = useState(user ? !!data.likes?.find(i => i._id === user.id) : false)
  const [image, setImage] = useState('')
  const [imageOpen, setImageOpen] = useState(false)

  if (data.author === null) {
    data.author = deletedUser
  }

  const imageView = (url) => {
    setImage(url)
    setImageOpen(true)
  }

  useEffect(() => {
    if (imageOpen) {
      document.body.classList.add('noscroll')
    } else {
      document.body.classList.remove('noscroll')
    }
  }, [imageOpen])

  useEffect(() => {
    setLikes(data.likes)
    setLiked(user ? !!data.likes?.find(i => i._id === user.id) : false)
  }, [user, data.likes])

  const likeFile = () => {
    fetch(BACKEND + '/api/file/like', {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileId: data._id })
    })
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          setLikes(data.likes)
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
  }

  const onLike = ({ target }) => {
    if (likesList.current?.contains(target)) return

    if (user) {
      setLiked(prev => !prev)
      likeFile()
    } else {
      history.push('/signup')
    }
  }

  const onDownload = () => {
    fetch(BACKEND + '/api/file/download', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileId: data._id })
    })
      .then(response => response.json())
      .then(res => {
        if (res.error) throw Error(data.error?.message || 'Error')

        const win = window.open(BACKEND + res.file.url, '_blank')
        win.focus()
      })
      .catch(console.error)
  }

  const copyLink = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(Strings.linkCopied[lang]))
      .catch(err => toast.error(Strings.failedToCopyLink[lang]))
  }

  return (
    <Fragment>
      <div className="card_item file_card">
        <div className="card_body">
          <div className="card_block">
            <header className="card_head column">
              {imageTypes.find(i => i === data.file.type) ? (
                <img
                  className="card_left"
                  src={BACKEND + data.file.url}
                  onClick={() => imageView(BACKEND + data.file.url)}
                  alt="Preview"
                />
              ) : videoTypes.find(i => i === data.file.type) ? (
                <video
                  className="card_left"
                  src={BACKEND + data.file.url}
                  poster={BACKEND + data.file.thumb}
                  controls
                />
              ) : null}

              <div className="card_head_inner">
                <div className="card_title full">{data.title}</div>

                <div className="card_info">
                  <Link to={'/user/' + data.author.name} className="head_text bold">
                    {data.author.displayName}
                    <UserRole role={data.author.role} />
                    {data.author.ban && <UserStatus status="ban" />}
                  </Link>
                  <span className="bullet">•</span>
                  <span className="head_text">
                    <time>{dateFormat(data.createdAt)}</time>
                  </span>
                </div>
              </div>

              {user && (
                <Dropdown>
                  <div onClick={() => copyLink(BACKEND + data.file.url)} className="dropdown_item">
                    {Strings.copyFileLink[lang]}
                  </div>
                  {user.role >= 2 && (
                    <div onClick={() => deleteFile()} className="dropdown_item">{Strings.delete[lang]}</div>
                  )}
                  {user.id === data.author._id || user.role >= 2 ? (
                    <div onClick={() => editFile()} className="dropdown_item">{Strings.edit[lang]}</div>
                  ) : null}
                </Dropdown>
              )}
            </header>

            <div className="card_content markdown">
              <Markdown
                source={data.body}
                onImageClick={imageView}
              />
            </div>

            <div className="card_content">
              <div>
                <span className="secondary_text">{Strings.extension[lang]}:</span>
                {fileExt.exec(data.file.url)[1]}
              </div>
              <div>
                <span className="secondary_text">{Strings.fileSize[lang]}:</span>
                {formatBytes(data.file.size)}
              </div>
            </div>

            <footer className="card_foot">
              <div className="act_btn foot_btn disable">
                <i className="bx bx-download" />
                <span className="card_count">{counter(data.downloads)}</span>
                <span className="hidden">
                  {declOfNum(data.downloads, [Strings.download1[lang], Strings.download2[lang], Strings.download3[lang]])}
                </span>
              </div>

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
          </div>
        </div>
      </div>

      <div className="card_item center">
        <Button
          className="main hollow"
          text={Strings.download[lang]}
          onClick={onDownload}
        />
      </div>

      {imageOpen && (
        <Lightbox
          mainSrc={image}
          onCloseRequest={() => setImageOpen(false)}
        />
      )}
    </Fragment>
  )
}

export default FileContent;

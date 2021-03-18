import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Lightbox from 'react-image-lightbox';

import { counter, declOfNum, dateFormat, formatBytes } from 'support/Utils';
import { BACKEND, Strings } from 'support/Constants';

import Markdown from 'components/Markdown';
import Dropdown from 'components/Card/Dropdown';

const FileContent = ({ data, user, token, lang }) => {
  const [image, setImage] = useState('')
  const [imageOpen, setImageOpen] = useState(false)
  const imageTypes = ['image/jpeg', 'image/png', 'image/gif']
  const regexp = /(?:\.([^.]+))?$/

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

  const onDelete = () => {
    return
  }

  const editClick = () => {
    return
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
                />
              ) : (
                <div className="card_left empty">
                  {regexp.exec(data.file.url)[1]}
                </div>
              )}

              <div className="card_head_inner">
                <div className="card_title full">{data.title}</div>

                <div className="card_info">
                  <Link to={'/user/' + data.author.name} className="head_text bold">{data.author.displayName}</Link>
                  <span className="bullet">•</span>
                  <span className="head_text">
                    <time>{dateFormat(data.createdAt)}</time>
                  </span>
                </div>
              </div>

              {user && (
                <Dropdown>
                  {user.role === 'admin' && (
                    <div onClick={onDelete} className="dropdown_item">{Strings.delete[lang]}</div>
                  )}
                  {user.id === data.author._id || user.role === 'admin' ? (
                    <div onClick={editClick} className="dropdown_item">{Strings.edit[lang]}</div>
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

            <footer className="card_foot">
              <div className="act_btn foot_btn disable">
                <i className="bx bx-download" />
                <span className="card_count">{counter(data.downloads)}</span>
                <span className="hidden">
                  {declOfNum(data.downloads, [Strings.download1[lang], Strings.download2[lang], Strings.download3[lang]])}
                </span>
              </div>

              <div className="act_btn foot_btn disable">
                <i className="bx bx-heart" />
                  <span className="card_count">{counter(data.likes.length)}</span>
                  <span className="hidden">
                    {declOfNum(data.likes.length, [Strings.like1[lang], Strings.like2[lang], Strings.like3[lang]])}
                  </span>
              </div>
            </footer>
          </div>
        </div>
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

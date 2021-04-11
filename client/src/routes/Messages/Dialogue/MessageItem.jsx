import { Fragment, useState } from 'react';
import Lightbox from 'react-image-lightbox';
import { toast } from 'react-toastify';

import { BACKEND, imageTypes, videoTypes } from 'support/Constants';
import { dateFormat } from 'support/Utils';

import Markdown from 'components/Markdown';
import VideoLightbox from 'components/VideoLightbox';

const MessageItem = ({ data, dialogueId, user, token }) => {
  const [image, setImage] = useState('')
  const [imageOpen, setImageOpen] = useState(false)
  const [video, setVideo] = useState('')
  const [videoOpen, setVideoOpen] = useState(false)

  const imageView = (url) => {
    setImage(url)
    setImageOpen(true)
  }

  const videoView = (url) => {
    setVideo(url)
    setVideoOpen(true)
  }

  const regexp = /(?:\.([^.]+))?$/
  const my = user.id === data.from._id

  const deleteMessage = () => {
    fetch(BACKEND + '/api/message/delete', {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messageId: data._id, dialogueId  })
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) throw Error(data.error?.message || 'Error')
      })
      .catch(err => toast.error(err.message))
  }

  return (
    <div className={my ? 'message_item my' : 'message_item'}>
      <div className={`message_body markdown`} id={'msg_' + data._id}>
        <div className="message_content">
          {data.file && (
            <div className={data.file.length > 1 ? 'msg_file_grid group' : 'msg_file_grid one'}>
              {data.file.map((item, index) => (
                <Fragment key={index}>
                  {imageTypes.find(i => i === item.type) ? (
                    <div
                      onClick={() => imageView(BACKEND + item.file)}
                      className="msg_file"
                      style={{ backgroundImage: `url(${BACKEND + item.file})` }}
                    />
                  ) : videoTypes.find(i => i === item.type) ? (
                    <div onClick={() => videoView(BACKEND + item.file)} className="msg_file bx video">
                      <div className="attached_info">{regexp.exec(item.file)[1]}</div>
                    </div>
                  ) : (
                    <div onClick={() => window.open(BACKEND + item.file)} className="msg_file empty">
                      <div className="attached_info">{regexp.exec(item.file)[1]}</div>
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          )}

          <Markdown source={data.body} onImageClick={imageView} />
        </div>
        <span className="message_info">
          {dateFormat(data.createdAt, 'short')}
          {my && data.read && <i className="bx bx-check-double" />}
        </span>
        {my && (
          <div className="message_actions">
            <div className="message_action_item" onClick={deleteMessage}>
              <i className="bx bx-trash-alt" />
            </div>
          </div>
        )}
      </div>

      {imageOpen && (
        <Lightbox
          mainSrc={image}
          onCloseRequest={() => setImageOpen(false)}
        />
      )}

      {videoOpen && (
        <VideoLightbox
          source={video}
          onCloseRequest={() => setVideoOpen(false)}
        />
      )}
    </div>
  )
}

export default MessageItem;

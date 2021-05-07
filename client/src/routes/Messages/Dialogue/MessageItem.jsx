import { Fragment, useState } from 'react';
import { toast } from 'react-toastify';

import { BACKEND, imageTypes, videoTypes, fileExt } from 'support/Constants';
import { dateFormat, formatBytes } from 'support/Utils';

import Markdown from 'components/Markdown';
import VideoLightbox, { ImageLightbox} from 'components/VideoLightbox';

const MessageItem = ({ data, groupId, user, token }) => {
  const [image, setImage] = useState('')
  const [imageOpen, setImageOpen] = useState(false)
  const [video, setVideo] = useState('')
  const [thumb, setThumb] = useState('')
  const [videoOpen, setVideoOpen] = useState(false)

  const imageView = (url) => {
    setImage(url)
    setImageOpen(true)
  }

  const videoView = (url, thumbUrl) => {
    setVideo(url)
    setThumb(thumbUrl)
    setVideoOpen(true)
  }

  const my = user.id === data.from._id

  const deleteMessage = () => {
    fetch(BACKEND + '/api/message/delete', {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messageId: data._id, groupId, dialogueId: data.dialogueId  })
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) throw Error(data.error?.message || 'Error')
      })
      .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
  }

  return (
    <div className={my ? 'message_item my' : 'message_item'}>
      <div className={`message_body markdown`} id={'msg_' + data._id}>
        <div className="message_content">
          {data.file && data.file.length ? (
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
                    <div
                      onClick={() => videoView(BACKEND + item.file, BACKEND + item.thumb)}
                      className="msg_file bx video"
                      style={{ backgroundImage: `url(${BACKEND + item.thumb})` }}
                    >
                      <div className="attached_info">{fileExt.exec(item.file)[1]}</div>
                    </div>
                  ) : (
                    <div onClick={() => window.open(BACKEND + item.file)} className="msg_file simple_file empty">
                      <div className="attached_info">
                        {fileExt.exec(item.file)[1]}
                        <br />
                        {formatBytes(item.size)}
                      </div>
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          ) : null}

          <Markdown source={data.body} onImageClick={imageView} />

          <span className="message_info">
            {dateFormat(data.createdAt, 'onlyTime')}
            {my && data.read && <i className="bx bx-check-double" />}
          </span>
        </div>
        {my && (
          <div className="message_actions">
            <div className="message_action_item" onClick={deleteMessage}>
              <i className="bx bx-trash-alt" />
            </div>
          </div>
        )}
      </div>

      {imageOpen && <ImageLightbox image={image} onCloseRequest={() => setImageOpen(false)} />}

      {videoOpen && (
        <VideoLightbox
          source={video}
          thumb={thumb}
          onCloseRequest={() => setVideoOpen(false)}
        />
      )}
    </div>
  )
}

export default MessageItem;

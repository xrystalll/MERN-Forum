import { toast } from 'react-toastify';

import { BACKEND } from 'support/Constants';
import { dateFormat } from 'support/Utils';

import Markdown from 'components/Markdown';

const MessageItem = ({ data, dialogueId, user, token }) => {
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
          <Markdown source={data.body} />
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
    </div>
  )
}

export default MessageItem;

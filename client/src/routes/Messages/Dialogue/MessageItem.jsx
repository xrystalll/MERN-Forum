import { dateFormat } from 'support/Utils';

import Markdown from 'components/Markdown';

const MessageItem = ({ data, user }) => {
  const my = user.id === data.from._id

  const deleteMessage = () => {
    console.log('delete', data._id)
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

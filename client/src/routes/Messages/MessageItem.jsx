import { dateFormat } from 'support/Utils';

import Markdown from 'components/Markdown';

const MessageItem = ({ data, user }) => {
  const my = user.id === data.from._id

  return (
    <div className={`message_item${my ? ' my' : ''} markdown`}>
      <div className="message_content">
        <Markdown source={data.body} />
      </div>
      <span className="message_info">
        {dateFormat(data.createdAt, 'short')}
        {my && data.read && <i className="bx bx-check-double" />}
      </span>
    </div>
  )
}

export default MessageItem;

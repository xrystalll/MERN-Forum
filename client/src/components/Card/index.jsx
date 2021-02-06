import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

const Card = ({ data, full }) => {
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif']
  const imageFile = data?.attach?.length
    ? imageTypes.find(i => i === data.attach.type) ? { backgroundImage: `url(${data.attach.file})`} : null
    : null

  return (
    <div className="card_item">
      {full && <a id={data.id} href={'#' + data.id} className="anchor"> </a>}

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
                  <time>{moment(data.createdAt).fromNow()}</time>
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
              <footer className="card_foot">
                <div className="act_btn foot_btn">
                  <i className="bx bx-reply bx-flip-horizontal"></i>
                  <span>Answer</span>
                </div>

                <div className="act_btn foot_btn">
                  <i className="bx bx-heart"></i>
                  {data.likeCount > 0 && (
                    <Fragment>
                      <span className="card_count">{data.likeCount}</span>
                      <span className="hidden">likes</span>
                    </Fragment>
                  )}
                </div>

                {data.answersCount > 0 && (
                  <div className="act_btn foot_btn disable">
                    <i className="bx bx-message-square-detail"></i>
                    <span className="card_count">{data.answersCount}</span>
                    <span className="hidden">answers</span>
                  </div>
                )}

                {data?.edited?.length && (
                  <div className="act_btn foot_btn disable">
                    <i className="bx bx-pencil"></i>
                    <span className="card_count">{moment(data.edited[0].createdAt).fromNow()}</span>
                  </div>
                )}
              </footer>
            ) : (
              <div className="act_btn foot_btn disable">
                <i className="bx bx-message-square-detail"></i>
                <span className="card_count">{data.answersCount || 0}</span>
                <span className="hidden">answers</span>
              </div>
            )}
          </footer>
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
              <span className="card_count">{data.threadsCount}</span>
              <span className="hidden">threads</span>
            </div>

            <div className="act_btn foot_btn disable">
              <i className="bx bx-message-square-detail"></i>
              <span className="card_count">{data.messagesCount}</span>
              <span className="hidden">messages</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export { Card, BoardCard };

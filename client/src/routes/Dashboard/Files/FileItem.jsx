import { useState } from 'react';
import { Link } from 'react-router-dom';

import { dateFormat, deletedUser } from 'support/Utils';
import { BACKEND, Strings, imageTypes, videoTypes, fileExt } from 'support/Constants';

import { UserRole, UserStatus } from 'components/UserBadge';
import Markdown from 'components/Markdown';

const FileItem = ({ data, moderate, lang }) => {
  const [collapsed, setCollapsed] = useState(true)

  const onModerate = ({ type }) => {
    moderate(type, data._id)
  }

  if (data.author === null) {
    data.author = deletedUser
  }

  return (
    <div className="card_item file_card">
      <div className="card_body">
        <div className="card_block with_left">
          {imageTypes.find(i => i === data.file.type) ? (
            <div
              className="card_left"
              style={{ backgroundImage: `url(${BACKEND + data.file.url})` }}
            />
          ) : videoTypes.find(i => i === data.file.type) ? (
            <div
              className="card_left"
              style={{ backgroundImage: `url(${BACKEND + data.file.thumb})` }}
            >
              <div className="attached_info">{fileExt.exec(data.file.url)[1]}</div>
            </div>
          ) : (
            <div className="card_left empty">
              <div className="attached_info">{fileExt.exec(data.file.url)[1]}</div>
            </div>
          )}

          <div className="card_right">
            <header className="card_head">
              <div className="card_head_inner">
                <Link to={'/file/' + data._id} className="card_title">{data.title}</Link>

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
            </header>

            <div className="card_content markdown">
              <Markdown
                source={collapsed && data.body.length > 100 ? data.body.slice(0, 100) + '...' : data.body}
              />

              {data.body.length > 100 && (
                <div
                  className="text_show_more"
                  onClick={() => setCollapsed(!collapsed)}
                >
                  {collapsed ? Strings.showMore[lang] : Strings.showLess[lang]}
                </div>
              )}
            </div>

            <footer className="card_foot">
              <a href={BACKEND + data.file.url} className="act_btn foot_btn" target="_blank" rel="noopener noreferrer">
                <i className="bx bx-download" />
                <span className="card_count">{Strings.download[lang]}</span>
              </a>
              <div className="act_btn foot_btn edit" onClick={() => onModerate({ type: 'publish' })}>
                <i className="bx bx-check" />
                <span className="hidden">{Strings.publish[lang]}</span>
              </div>
              <div className="act_btn foot_btn delete" onClick={() => onModerate({ type: 'delete' })}>
                <i className="bx bx-trash-alt" />
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileItem;

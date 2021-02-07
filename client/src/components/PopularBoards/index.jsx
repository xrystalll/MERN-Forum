import { Link } from 'react-router-dom';

import { counter, declOfNum } from 'support/Utils';
import './style.css';

const PopularBoardsContainer = ({ children }) => {
  return (
    <div className="boards_slide">
      <ul className="boards_slide_list">
        {children}
      </ul>
    </div>
  )
}

const PopularBoardsItem = ({ data }) => {
  return (
    <li className="boards_slide_item">
      <Link to={'/boards/' + data.id}>
        <span className="slide_title">{data.title}</span>
        <span className="slide_content">
          {counter(data.threadsCount)} {declOfNum(data.threadsCount, ['thread', 'threads', 'threads'])}
        </span>
      </Link>
    </li>
  )
}

export { PopularBoardsContainer, PopularBoardsItem };

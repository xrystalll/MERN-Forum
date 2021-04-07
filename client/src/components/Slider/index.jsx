import { Link } from 'react-router-dom';

import { Strings } from 'support/Constants';
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

const PopularBoardsItem = ({ data, lang }) => {
  return (
    <li className="boards_slide_item">
      <Link to={'/boards/' + data.name} className="slide_item_text">
        <span className="slide_title">{data.title}</span>
        <span className="slide_content">
          {counter(data.threadsCount)} {declOfNum(data.threadsCount, [Strings.thread1[lang], Strings.thread2[lang], Strings.thread3[lang]])}
        </span>
      </Link>
    </li>
  )
}

const SlidesContainer = ({ children }) => {
  return (
    <div className="boards_slide">
      <ul className="boards_slide_list slides_list">
        {children}
      </ul>
    </div>
  )
}
const SlideItem = ({ title, count }) => {
  return (
    <li className="boards_slide_item stats_item">
      <div className="slide_item_text">
        <span className="slide_title">{title}</span>
        <span className="slide_content">
          {counter(count)}
        </span>
      </div>
    </li>
  )
}
export { PopularBoardsContainer, PopularBoardsItem, SlidesContainer, SlideItem };

import { useRef } from 'react';
import { Link } from 'react-router-dom';

import { Strings } from 'support/Constants';
import { counter, declOfNum } from 'support/Utils';

import './style.css';

const ControlledSlider = ({ items, lang }) => {
  const slider = useRef()
  const itemWidth = '122'

  const scrollToNextItem = () => {
    slider.current.scrollBy({
      top: 0,
      left: itemWidth,
      behavior: 'smooth'
    })
  }
  const scrollToPrevItem = () => {
    slider.current.scrollBy({
      top: 0,
      left: -itemWidth,
      behavior: 'smooth'
    })
  }

  return (
    <div className="boards_slide">
      <ul
        ref={slider}
        className="boards_slide_list"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(${itemWidth}px, 1fr))` }}
      >
        <div className="boards_slide_nav prev" onClick={scrollToPrevItem}>
          <div className="slide_nav_btn">
            <i className="bx bx-left-arrow-alt" />
          </div>
        </div>

        {items.map(item => (
          <PopularBoardsItem key={item._id} data={item} lang={lang} />
        ))}

        <div className="boards_slide_nav next" onClick={scrollToNextItem}>
          <div className="slide_nav_btn">
            <i className="bx bx-right-arrow-alt" />
          </div>
        </div>
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
export { ControlledSlider, SlidesContainer, SlideItem };

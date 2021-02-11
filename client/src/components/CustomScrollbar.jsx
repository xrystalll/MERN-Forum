import { Scrollbars } from 'react-custom-scrollbars';

const CustomScrollbar = ({ className, children }) => {
  return (
    <Scrollbars
      autoHide
      renderTrackHorizontal={props => <div {...props} className="track-horizontal" />}
      renderTrackVertical={props => <div {...props} className="track-vertical" />}
      renderThumbHorizontal={props => <div {...props} className="thumb-horizontal" />}
      renderThumbVertical={props => <div {...props} className="thumb-vertical" />}
      renderView={props => <div {...props} className={className} />}
    >
      {children}
    </Scrollbars>
  )
}

export default CustomScrollbar;

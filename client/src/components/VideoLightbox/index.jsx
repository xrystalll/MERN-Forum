import { useEffect, useRef } from 'react';

const VideoLightbox = ({ source, onCloseRequest }) => {
  const lightboxContent = useRef()

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    // eslint-disable-next-line
  }, [])

  const handleClickOutside = ({ target }) => {
    if (lightboxContent.current?.contains(target)) return

    onCloseRequest()
  }

  return (
    <div className="ReactModalPortal">
      <div
        className="ReactModal__Overlay ReactModal__Overlay--after-open"
        style={{ position: 'fixed', inset: '0px', zIndex: '1000' }}
      >
        <div
          className="ReactModal__Content ReactModal__Content--after-open"
          role="dialog"
          aria-label="Lightbox"
          aria-modal="true"
          style={{ position: 'absolute', inset: '0px', overflow: 'hidden' }}
        >
          <div
            className="ril-outer ril__outer ril__outerAnimating"
            style={{ transition: 'opacity 300ms ease 0s', animationDuration: '300ms', animationDirection: 'reverse' }}
          >
            <div className="ril-inner ril__inner">
              <video
                ref={lightboxContent}
                className="ril__image"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
                src={source}
                controls
                autoPlay
              />
            </div>

            <div className="ril-toolbar ril__toolbar">
              <ul className="ril-toolbar-left ril__toolbarSide ril__toolbarLeftSide">
                <li className="ril-toolbar__item ril__toolbarItem">
                  <span className="ril-toolbar__item__child ril__toolbarItemChild" />
                </li>
              </ul>

              <ul className="ril-toolbar-right ril__toolbarSide ril__toolbarRightSide">
                <li className="ril-toolbar__item ril__toolbarItem">
                  <button
                    onClick={onCloseRequest}
                    type="button"
                    aria-label="Close lightbox"
                    className="ril-close ril-toolbar__item__child ril__toolbarItemChild ril__builtinButton ril__closeButton"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoLightbox;

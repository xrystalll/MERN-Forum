import { useContext, useEffect, useRef } from 'react';
import Lightbox from 'react-image-lightbox';

import { StoreContext } from 'store/Store';

import { Strings } from 'support/Constants';

import './style.css';

export const ImageLightbox = ({ image, onCloseRequest }) => {
  const { lang } = useContext(StoreContext)

  return (
    <Lightbox
      mainSrc={image}
      onCloseRequest={() => onCloseRequest(false)}
      toolbarButtons={[
        <div className="ril__builtinTitle">{Strings.searchIn[lang]}: </div>,
        <a
          href={'https://yandex.com/images/search?rpt=imageview&url=' + image}
          className="ril__builtinButton"
          target="_blank"
          rel="noopener noreferrer"
          title="Yandex"
        >
          Я
        </a>,
        <a
          href={'https://www.google.com/searchbyimage?image_url=' + image}
          className="ril__builtinButton"
          target="_blank"
          rel="noopener noreferrer"
          title="Google"
        >
          <i className="bx bxl-google" />
        </a>
      ]}
    />
  )
}

const VideoLightbox = ({ source, thumb, onCloseRequest }) => {
  const { lang } = useContext(StoreContext)
  const lightboxContent = useRef()

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
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
            style={{ transition: 'opacity 300ms 0s', animationDuration: '300ms', animationDirection: 'reverse' }}
          >
            <div className="ril-inner ril__inner">
              <video
                ref={lightboxContent}
                className="ril__image"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
                src={source}
                poster={thumb}
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
                {thumb && (
                  <>
                    <li className="ril-toolbar__item ril__toolbarItem">
                      <div className="ril__builtinTitle">{Strings.searchIn[lang]}: </div>
                    </li>
                    <li className="ril-toolbar__item ril__toolbarItem">
                      <a
                        href={'https://yandex.com/images/search?rpt=imageview&amp;url=' + thumb}
                        className="ril__builtinButton"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Yandex"
                      >
                        Я
                      </a>
                    </li>
                    <li className="ril-toolbar__item ril__toolbarItem">
                      <a
                        href={'https://www.google.com/searchbyimage?image_url=' + thumb}
                        className="ril__builtinButton"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Google"
                      >
                        <i className="bx bxl-google" />
                      </a>
                    </li>
                  </>
                )}
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

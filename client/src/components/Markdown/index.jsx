import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import './style.css';

const Markdown = ({ source, onImageClick }) => {
  const addLink = (text) => {
    // eslint-disable-next-line
    const reUrl = /([^\[\(])(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}[-a-zA-Z0-9@:%_\+.~#?&//=]*)([^\]\)])/g
    return text.replace('````', '``').replace(reUrl, '$1[$2]($2)$3')
  }
  const onClick = (src) => {
    onImageClick && onImageClick(src)
  }
  const renderers = {
    code: ({ language, value }) => <SyntaxHighlighter style={materialDark} language={language} showLineNumbers children={value} />,
    link: ({ href, children }) => {
      let url
      if (!href.startsWith('/')) {
        try {
          url = new URL(href)
        } catch(e) {
          url = href
        }
      } else {
        url = {
          origin: window.location.origin,
          pathname: href
        }
      }

      if (url.origin === window.location.origin) {
        return <Link to={url.pathname}>{children}</Link>
      }

      return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
    },
    image: ({ src, alt }) => <img onClick={() => onClick(src)} src={src} alt={alt} />,
    thematicBreak: () => <hr />,
    inlineCode: ({ children }) => <span className="spoiler"><span className="spoiler_text">{children}</span></span>
  }
 
  const allowed = ['text', 'break', 'thematicBreak', 'paragraph', 'emphasis', 'strong', 'blockquote', 'link', 'image', 'list', 'listItem', 'heading', 'inlineCode', 'code']

  return (
    <ReactMarkdown source={addLink(source)} allowedTypes={allowed} renderers={renderers} />
  )
}

export default Markdown;

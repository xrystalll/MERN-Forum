import { useContext, useRef } from 'react';

import { StoreContext } from 'store/Store';

import { Strings } from 'support/Constants';

const TextareaForm = ({ name, value, placeholder = '', required = false, onChange, className, panel = true }) => {
  const { lang } = useContext(StoreContext)
  const textarea = useRef()

  const handleTag = (tag) => {
    switch(tag) {
      case 'italic':
        pasteCode({ code: '__', cursor: 1 })
        break
      case 'bold':
        pasteCode({ code: '****', cursor: 2 })
        break
      case 'link':
        pasteCode({ code: '[Link title]()', cursor: 1 })
        break
      case 'spoiler':
        // eslint-disable-next-line
        pasteCode({ code: '\`\`', cursor: 1 })
        break
      case 'image':
        pasteCode({ code: '![image]()', cursor: 1})
        break
      case 'code':
        // eslint-disable-next-line
        pasteCode({ code: '\`\`\`\n\n\`\`\`', cursor: 4 })
        break
      default:
        return
    }
  }

  const pasteCode = ({ code, cursor = 0 }) => {
    const area = textarea.current
    const start = area.selectionStart
    const end = area.selectionEnd
    const value = area.value.substring(0, start) + code + area.value.substring(end)
    area.value = value
    area.focus()
    area.selectionEnd = end + code.length - cursor
  }

  return (
    <div className={className || 'form_block'}>
      {panel && (
        <div className="form_foot">
          <div className="act_group">
            <div className="bb_btn" role="button" onClick={() => handleTag('italic')} title="Italic">
              <i className="bx bx-italic" />
            </div>
            <div className="bb_btn" role="button" onClick={() => handleTag('bold')} title="Bold">
              <i className="bx bx-bold" />
            </div>
            <div className="bb_btn" role="button" onClick={() => handleTag('link')} title="Link">
              <i className="bx bx-link" />
            </div>
            <div className="bb_btn" role="button" onClick={() => handleTag('spoiler')} title="Spoiler">
              <i className="bx bx-hide" />
            </div>
            <div className="bb_btn" role="button" onClick={() => handleTag('image')} title="Image">
              <i className="bx bx-image-alt" />
            </div>
            <div className="bb_btn" role="button" onClick={() => handleTag('code')} title="Code">
              <i className="bx bx-code-alt" />
            </div>
            <div className="bb_btn md" title={Strings.textFieldSupportsMarkdown[lang]}>
              <i className="bx bxl-markdown" />
            </div>
          </div>
        </div>
      )}

      <div className="text_area">
        <textarea
          ref={textarea}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
          maxLength="1000"
        />
      </div>
    </div>
  )
}

export default TextareaForm;

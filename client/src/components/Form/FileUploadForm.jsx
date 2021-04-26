import { Fragment, useContext, useEffect, useState } from 'react';

import { StoreContext } from 'store/Store';

import { Strings, imageTypes, fileExt } from 'support/Constants';

import FileInput from './FileInput';

const FileUploadForm = ({ mini, title, hint, sendFiles, clearFiles, multiple = true, accept }) => {
  const { lang } = useContext(StoreContext)
  const [files, setFiles] = useState([])
  const [inputVisible, setInputVisible] = useState(true)
  const maxCount = multiple ? 4 : 1

  useEffect(() => {
    if (clearFiles) {
      setFiles([])
      setInputVisible(true)
    }
    if (files.length > 0) {
      sendFiles && sendFiles(files)
    } else {
      setInputVisible(true)
    }
  }, [files, sendFiles, clearFiles])

  useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  })

  const handlePaste = (e) => {
    if (files.length >= maxCount) return

    const newFile = e.clipboardData.files[0]
    if (!newFile || newFile.type.indexOf('image') === -1) return

    const mergedArray = [...files, newFile]
    let limitedArray = mergedArray.slice(0, maxCount)
    limitedArray.map(i => i.url = URL.createObjectURL(i))
    setFiles(limitedArray)
    setInputVisible(false)
  }

  const handleFile = (e) => {
    if (files.length >= maxCount) return

    const newFiles = e.target.files
    const newFilesArray = Array.from(newFiles)
    const mergedArray = [...files, ...newFilesArray]
    let limitedArray = mergedArray.slice(0, maxCount)
    limitedArray.map(i => i.url = URL.createObjectURL(i))
    setFiles(limitedArray)
    setInputVisible(false)
  }

  const removeFile = (file) => {
    setFiles(files.filter(i => i.url !== file.url))
    sendFiles(files.filter(i => i.url !== file.url))
  }

  return (
    !mini ? (
      <div className={files.length ? 'card_item attach_list' : 'card_item'}>
        {files && (
          files.map((item, index) => (
            <Fragment key={index}>
              {imageTypes.find(i => i === item.type) ? (
                <div className="attached_file card_left" style={{ backgroundImage: `url(${item.url})` }}>
                  <span className="remove_file" onClick={() => removeFile(item)}>
                    <i className="bx bx-x" />
                  </span>
                </div>
              ) : (
                <div className="attached_file card_left empty">
                  <span className="remove_file" onClick={() => removeFile(item)}>
                    <i className="bx bx-x" />
                  </span>
                  <div className="attached_info">{fileExt.exec(item.name)[1]}</div>
                </div>
              )}
            </Fragment>
          ))
        )}

        {inputVisible && (
          <div className="card_body file_input_body">
            <div className="card_outside_title with_hint">
              {title || Strings.attachFile[lang]}
              <div className="title_hint">
                <i className="bx bx-help-circle" />
                <div className="hint_popover">
                  {hint || `${Strings.maxFilesCount[lang]}: 4; ${Strings.maxSize[lang]}: 20 Mb ${Strings.perFile[lang]}`}
                </div>
              </div>
            </div>

            <div className="form_block">
              <FileInput
                onChange={handleFile}
                multiple={multiple}
                accept={accept}
                disabled={files.length >= maxCount}
              />
            </div>
          </div>
        )}
      </div>
    ) : (
      <Fragment>
        {files.length ? (
          <div className="card_item attach_list">
            {files && (
              files.map((item, index) => (
                <Fragment key={index}>
                  {imageTypes.find(i => i === item.type) ? (
                    <div className="attached_file card_left" style={{ backgroundImage: `url(${item.url})` }}>
                      <span className="remove_file" onClick={() => removeFile(item)}>
                        <i className="bx bx-x" />
                      </span>
                    </div>
                  ) : (
                    <div className="attached_file card_left empty">
                      <span className="remove_file" onClick={() => removeFile(item)}>
                        <i className="bx bx-x" />
                      </span>
                      <div className="attached_info">{fileExt.exec(item.name)[1]}</div>
                    </div>
                  )}
                </Fragment>
              ))
            )}
          </div>
        ) : null}

        <input
          id="miniFileInput"
          type="file"
          className="miniFileInput"
          multiple={multiple}
          accept={accept}
          onChange={handleFile}
          disabled={files.length >= maxCount}
        />
        <label htmlFor="miniFileInput" className="message_action_item send_file" title={Strings.chooseAFile[lang]}>
          <i className="bx bx-paperclip" />
        </label>
      </Fragment>
    )
  )
}

export default FileUploadForm;

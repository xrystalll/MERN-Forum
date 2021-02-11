import { Fragment, useEffect, useState } from 'react';

import FileInput from './FileInput';

const FileUploadForm = ({ hint, sendFiles, multiple = true, accept }) => {
  const [files, setFiles] = useState([])
  const [inputVisible, setInputVisible] = useState(true)
  const imageTypes = ['image/jpeg', 'image/png', 'image/gif']
  const maxCount = multiple ? 4 : 1
  const regexp = /(?:\.([^.]+))?$/

  useEffect(() => {
    !files.length && setInputVisible(true)
  }, [files])

  useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => {
      document.removeEventListener('mousedown', handlePaste)
    }
  })

  const handlePaste = (e) => {
    if (files.length >= maxCount + 1) return

    const newFile = e.clipboardData.files[0]
    if (!newFile || newFile.type.indexOf('image' === -1)) return

    const mergedArray = [...files, newFile]
    let limitedArray = mergedArray.slice(0, maxCount)
    limitedArray.map(i => i.url = URL.createObjectURL(i))
    setFiles(limitedArray)
    setInputVisible(false)

    sendFiles(files)
  }

  const handleFile = (e) => {
    if (files.length >= maxCount + 1) return

    const newFiles = e.target.files
    const newFilesArray = Array.from(newFiles)
    const mergedArray = [...files, ...newFilesArray]
    let limitedArray = mergedArray.slice(0, maxCount)
    limitedArray.map(i => i.url = URL.createObjectURL(i))
    setFiles(limitedArray)
    setInputVisible(false)

    sendFiles(files)
  }

  const removeFile = (file) => {
    setFiles(files.filter(i => i.url !== file.url))
  }

  return (
    <div className={files.length ? 'card_item attach_list' : 'card_item'}>
      {files && (
        files.map((item, index) => (
          <Fragment key={index}>
            {imageTypes.find(i => i === item.type) ? (
              <div className="attached_file card_left" style={{ backgroundImage: `url(${item.url})` }}>
                <span className="remove_file" onClick={() => removeFile(item)}>
                  <i className="bx bx-x"></i>
                </span>
              </div>
            ) : (
              <div className="attached_file card_left empty">
                <span className="remove_file" onClick={() => removeFile(item)}>
                  <i className="bx bx-x"></i>
                </span>
                <div className="attached_info">{regexp.exec(item.name)[1]}</div>
              </div>
            )}
          </Fragment>
        ))
      )}

      {inputVisible && (
        <div className="card_body file_input_body">
          <div className="card_outside_title with_hint">
            Attach file
            <div className="title_hint">
              <i className="bx bx-help-circle"></i>
              <div className="hint_popover">{hint || 'Max files count: 4'}</div>
            </div>
          </div>

          <div className="form_block">
            <FileInput onChange={handleFile} multiple={multiple} accept={accept} disabled={files.length >= maxCount} />
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUploadForm;

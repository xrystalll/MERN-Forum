const FileInput = ({ onChange, multiple = false, accept, disabled }) => {
  return (
    <div className="file_area">
      <input id="fileInput" type="file" multiple={multiple} accept={accept} onChange={onChange} disabled={disabled} />
      <label htmlFor="fileInput" className="file_input" title="Choose file">
        <div className="secondary_btn">Choose</div>
        <span>File not selected</span>
      </label>
    </div>
  )
}

export default FileInput;

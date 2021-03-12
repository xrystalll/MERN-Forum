import { useContext } from 'react';

import { StoreContext } from 'store/Store';

import { Strings } from 'support/Constants';

const FileInput = ({ onChange, multiple = false, accept, disabled }) => {
  const { lang } = useContext(StoreContext)

  return (
    <div className="file_area">
      <input
        id="fileInput"
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={onChange}
        disabled={disabled}
      />
      <label htmlFor="fileInput" className="file_input" title={Strings.chooseAFile[lang]}>
        <div className="secondary_btn">{Strings.choose[lang]}</div>
        <span>{Strings.fileNotSelected[lang]}</span>
      </label>
    </div>
  )
}

export default FileInput;

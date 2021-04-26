import { useState } from 'react';

const Input = ({ type = 'text', name, value, placeholder = '', required = false, maxLength, onChange, onFocus, onBlur }) => {
  const [showPass, setShowPass] = useState(false)

  return (
    <>
      <input
        className="input_area"
        type={type === 'password' ? showPass ? 'text' : 'password' : type}
        name={name}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {type === 'password' && (
        <div className="input_action" onClick={() => setShowPass(prev => !prev)}>
          {showPass
            ? <i className="bx bx-show" />
            : <i className="bx bx-hide" />
          }
        </div>
      )}
    </>
  )
}

export default Input;

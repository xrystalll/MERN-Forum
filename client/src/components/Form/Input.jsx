const Input = ({ type = 'text', name, value, placeholder = '', required = false, maxLength, onChange, onFocus, onBlur }) => {
  return (
    <input
      className="input_area"
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      maxLength={maxLength}
      required={required}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  )
}

export default Input;

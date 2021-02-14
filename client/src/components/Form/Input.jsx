const Input = ({ type = 'text', name, value, placeholder = '', required = false, maxLength, onChange }) => {
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
    />
  )
}

export default Input;

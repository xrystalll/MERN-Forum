const Input = ({ type = 'text', name, value, placeholder = '', required = false, maxlength, onChange }) => {
  return (
    <input
      className="input_area"
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      maxlength={maxlength}
      required={required}
      onChange={onChange}
    />
  )
}

export default Input;

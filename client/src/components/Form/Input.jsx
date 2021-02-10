const Input = ({ type = 'text', name, value, placeholder = '', required = false, onChange }) => {
  return (
    <input
      className="input_area"
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      required={required}
      onChange={onChange}
    />
  )
}

export default Input;

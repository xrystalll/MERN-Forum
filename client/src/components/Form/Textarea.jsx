const Textarea = ({ name, value, placeholder = '', required = false, onChange }) => {
  return (
    <textarea
      name={name}
      value={value}
      placeholder={placeholder}
      required={required}
      onChange={onChange}
    />
  )
}

export default Textarea;

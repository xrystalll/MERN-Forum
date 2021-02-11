import './style.css';

const InputButton = ({ text }) => {
  return (
    <input className="btn" type="submit" value={text} />
  )
}

export { InputButton };

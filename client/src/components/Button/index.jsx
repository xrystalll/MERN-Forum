import './style.css';

const InputButton = ({ text }) => {
  return (
    <input className="btn" type="submit" value={text} />
  )
}

const Button = ({ text, className, onClick }) => {
  return (
    <div onClick={onClick} className={'btn ' + className}>
      {text}
    </div>
  )
}

export { InputButton, Button };

import { Link } from 'react-router-dom';

import './style.css';

const InputButton = ({ text, className }) => {
  return (
    <input className={className ? 'btn ' + className : 'btn'} type="submit" value={text} />
  )
}

const LinkButton = ({ text, className, link }) => {
  return (
    <Link to={link} className={'btn ' + className}>
      {text}
    </Link>
  )
}

const Button = ({ text, className, onClick }) => {
  return (
    <div onClick={onClick} className={'btn ' + className}>
      {text}
    </div>
  )
}

export { InputButton, LinkButton, Button };

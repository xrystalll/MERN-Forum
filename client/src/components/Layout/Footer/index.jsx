import './style.css';

const Footer = () => {
  return (
    <footer className="general_footer">
      <span className="copyright">Forum, {new Date().getFullYear()}. by xrystalll</span>
      <ul>
        <li className="footer_link">
          <a href="https://github.com/xrystalll" target="_blank" rel="noopener noreferrer">My Github</a>
        </li>
      </ul>
    </footer>
  )
}

export default Footer;

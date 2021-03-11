import { Link } from 'react-router-dom';

import './style.css';

export const Section = ({ children }) => {
  return (
    <section className="main_section">
      {children}
    </section>
  )
}

export const SectionHeader = ({ title, link }) => {
  return link ? (
    <div className="section_header with_link">
      <h2>{title}</h2>
      <div className="more_link">
        <Link to={link.url}>
          {link.title}
          <i className="bx bx-chevron-right" />
        </Link>
      </div>
    </div>
  ) : (
    <div className="section_header">
      <h2>{title}</h2>
    </div>
  )
}

import { Link } from 'react-router-dom';

import { Section, SectionHeader } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';

const NotFound = () => {
  document.title = 'Forum | 404 Not Found'

  return (
    <Section>
      <Breadcrumbs current="Not Found" links={[
        { title: 'Home', link: '/' }
      ]} />

      <SectionHeader title="Error 404. Page not found" />

      <Link to="/">Go to home page</Link>
    </Section>
  )
}

export { NotFound };

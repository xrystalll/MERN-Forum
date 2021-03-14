import { Fragment } from 'react';
import { useParams } from 'react-router-dom';

import { SectionHeader } from 'components/Section';

import { Strings } from 'support/Constants';

const Results = ({ lang }) => {
  const { searchQuery } = useParams()

  return (
    <Fragment>
      <SectionHeader title={Strings.searchResults[lang]} />

      <div>Results for: {searchQuery}</div>
    </Fragment>
  )
}

export default Results;

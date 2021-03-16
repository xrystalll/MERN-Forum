import { Fragment } from 'react';
import { useParams } from 'react-router-dom';

import { Strings } from 'support/Constants';

import { SectionHeader } from 'components/Section';

import Threads from './Threads';
import Answers from './Answers';
import Boards from './Boards';
import Users from './Users';

const Results = ({ lang, type }) => {
  const { searchQuery } = useParams()

  return (
    <Fragment>
      <SectionHeader title={Strings.searchResults[lang]} />

      {type === 'users' && <Users lang={lang} query={searchQuery} type={type} />}
      {type === 'boards' && <Boards lang={lang} query={searchQuery} type={type} />}
      {type === 'answers' && <Answers lang={lang} query={searchQuery} type={type} />}
      {type === 'threads' && <Threads lang={lang} query={searchQuery} type={type} />}
    </Fragment>
  )
}

export default Results;

import { useContext, useEffect, useState } from 'react';

import { StoreContext } from 'store/Store';

import { Strings } from 'support/Constants';

import { Section } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import SortNav from 'components/SortNav';

import Default from './Default';
import Popular from './Popular';
import NewestAnswer from './NewestAnswer';
import NewestThread from './NewestThread';
import Answers from './Answers';

const Boards = () => {
  const { setPostType, setFabVisible, lang } = useContext(StoreContext)
  document.title = 'Forum | ' + Strings.boards[lang]
  const [init, setInit] = useState(true)
  const [sort, setSort] = useState('default')

  useEffect(() => {
    if (init) {
      setFabVisible(true)
      setPostType({
        type: 'thread',
        id: null
      })
    }
    setInit(false)
    // eslint-disable-next-line
  }, [init])

  return (
    <Section>
      <Breadcrumbs current={Strings.allBoards[lang]} links={[
        { title: Strings.home[lang], link: '/' }
      ]} />

      <SortNav links={[
        { title: Strings.default[lang], sort: 'default' },
        { title: Strings.popular[lang], sort: 'popular' },
        { title: Strings.recentlyAnswered[lang], sort: 'newestanswer' },
        { title: Strings.byNewest[lang], sort: 'newestthread' },
        { title: Strings.byAnswersCount[lang], sort: 'answers' }
      ]} setSort={setSort} state={sort} />

      {sort === 'popular' && <Popular lang={lang} />}
      {sort === 'newestanswer' && <NewestAnswer lang={lang} />}
      {sort === 'newestthread' && <NewestThread lang={lang} />}
      {sort === 'answers' && <Answers lang={lang} />}
      {sort === 'default' && <Default lang={lang} />}
    </Section>
  )
}

export default Boards;

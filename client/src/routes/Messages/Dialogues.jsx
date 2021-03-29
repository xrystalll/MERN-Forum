import { Fragment, useContext } from 'react';

import { StoreContext } from 'store/Store';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { Strings } from 'support/Constants';

import Breadcrumbs from 'components/Breadcrumbs';
import { DialoqueCard } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const Dialogues = () => {
  const { lang } = useContext(StoreContext)
  const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'dialogues', auth: true })
  document.title = 'Forum | ' + Strings.messages[lang]

  return (
    <Fragment>
      <Breadcrumbs current={Strings.messages[lang]} links={[
        { title: Strings.home[lang], link: '/' }
      ]} />

      {!noData ? (
        !loading ? (
          items.length ? (
            <Fragment>
              <div className="items_list">
                {items.map(item => (
                  <DialoqueCard key={item._id} data={item} />
                ))}
              </div>

              {moreLoading && <Loader className="more_loader" color="#64707d" />}
            </Fragment>
          ) : <Errorer message={Strings.noMessagesYet[lang]} />
        ) : <Loader color="#64707d" />
      ) : (
        <Errorer message={Strings.unableToDisplayMessages[lang]} />
      )}
    </Fragment>
  )
}

export default Dialogues;

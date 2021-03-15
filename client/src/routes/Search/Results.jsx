import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { Strings } from 'support/Constants';

import { SectionHeader } from 'components/Section';
import { Card } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const Results = ({ lang }) => {
  const { searchQuery } = useParams()
  const { loading, moreLoading, noData, items, refetch } = useMoreFetch({ method: 'search', params: { query: searchQuery } })
  const [init, setInit] = useState(true)

  useEffect(() => {
    if (!init) {
      refetch((Math.random() * 100).toFixed())
    } else {
      setInit(false)
    }
  }, [searchQuery])

  return (
    <Fragment>
      <SectionHeader title={Strings.searchResults[lang]} />

      {!noData ? (
        !loading ? (
          items.length ? (
            <Fragment>
              <div className="items_list">
                {items.map(item => (
                  <Card key={item._id} data={item} />
                ))}
              </div>

              {moreLoading && <Loader className="more_loader" color="#64707d" />}
            </Fragment>
          ) : <Errorer message={Strings.noResults[lang]} />
        ) : <Loader color="#64707d" />
      ) : (
        <Errorer message={Strings.unableToDisplaySearchResults[lang]} />
      )}
    </Fragment>
  )
}

export default Results;

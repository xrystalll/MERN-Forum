import { Fragment } from 'react';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { Strings } from 'support/Constants';

import { FileCard } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const Items = ({ folderId, lang }) => {
  const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'files', params: { folderId } })

  return !noData ? (
    !loading ? (
      items.length ? (
        <Fragment>
          <div className="items_list">
            {items.map(item => (
              <FileCard key={item._id} data={item} />
            ))}
          </div>

          {moreLoading && <Loader className="more_loader" color="#64707d" />}
        </Fragment>
      ) : <Errorer message={Strings.noFilesYet[lang]} />
    ) : <Loader color="#64707d" />
  ) : <Errorer message={Strings.unableToDisplayFiles[lang]} />
}

export default Items;

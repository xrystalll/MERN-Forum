import { Fragment } from 'react';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { Strings } from 'support/Constants';

import { FolderCard } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const Items = ({ lang }) => {
  const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'folders' })

  return !noData ? (
    !loading ? (
      items.length ? (
        <Fragment>
          <div className="items_list">
            {items.map(item => (
              <FolderCard key={item._id} data={item} />
            ))}
          </div>

          {moreLoading && <Loader className="more_loader" color="#64707d" />}
        </Fragment>
      ) : <Errorer message={Strings.noFoldersYet[lang]} />
    ) : <Loader color="#64707d" />
  ) : <Errorer message={Strings.unableToDisplayFolders[lang]} />
}

export default Items;

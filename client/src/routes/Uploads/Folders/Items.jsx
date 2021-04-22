import { useMoreFetch } from 'hooks/useMoreFetch';

import { Strings } from 'support/Constants';

import DataView from 'components/DataView';
import { FolderCard } from 'components/Card';

const Items = ({ lang }) => {
  const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'folders' })

  return (
    <DataView
      data={items}
      noData={noData}
      loading={loading}
      moreLoading={moreLoading}
      card={FolderCard}
      noDataMessage={Strings.noFoldersYet[lang]}
      errorMessage={Strings.unableToDisplayFolders[lang]}
    />
  )
}

export default Items;

import { useMoreFetch } from 'hooks/useMoreFetch';

import { Strings } from 'support/Constants';

import DataView from 'components/DataView';
import { FileCard } from 'components/Card';

const Items = ({ folderId, lang }) => {
  const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'files', params: { folderId } })

  return (
    <DataView
      data={items}
      noData={noData}
      loading={loading}
      moreLoading={moreLoading}
      card={FileCard}
      noDataMessage={Strings.noFilesYet[lang]}
      errorMessage={Strings.unableToDisplayFiles[lang]}
    />
  )
}

export default Items;

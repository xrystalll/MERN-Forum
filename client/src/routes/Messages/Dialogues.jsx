import { useContext, useEffect } from 'react';

import { StoreContext } from 'store/Store';

import { useMoreFetch } from 'hooks/useMoreFetch';

import { Strings } from 'support/Constants';
import Socket, { joinToRoom, leaveFromRoom } from 'support/Socket';

import Breadcrumbs from 'components/Breadcrumbs';
import DataView from 'components/DataView';
import { DialoqueCard } from 'components/Card';

const Dialogues = () => {
  const { user, token, lang } = useContext(StoreContext)
  const { loading, moreLoading, noData, items, setItems } = useMoreFetch({ method: 'dialogues', auth: true })
  document.title = 'Forum | ' + Strings.messages[lang]

  useEffect(() => {
    joinToRoom('dialogues:' + user.id, { token })
    return () => {
      leaveFromRoom('dialogues:' + user.id)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    Socket.on('newDialogue', (data) => {
      setItems(prev => [data, ...prev])
    })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    Socket.on('updateDialogue', (data) => {
      let newArray = [...items]
      newArray[newArray.findIndex(item => item._id === data._id)] = data

      setItems(newArray)
    })
    // eslint-disable-next-line
  }, [items])

  return (
    <>
      <Breadcrumbs current={Strings.messages[lang]} links={[
        { title: Strings.home[lang], link: '/' }
      ]} />

      <DataView
        data={items}
        noData={noData}
        loading={loading}
        moreLoading={moreLoading}
        card={DialoqueCard}
        noDataMessage={Strings.noMessagesYet[lang]}
        errorMessage={Strings.unableToDisplayMessages[lang]}
      />
    </>
  )
}

export default Dialogues;

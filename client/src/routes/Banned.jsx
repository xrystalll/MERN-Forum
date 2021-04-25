import { useContext, useEffect, useState } from 'react';

import { StoreContext } from 'store/Store';

import Socket, { joinToRoom, leaveFromRoom } from 'support/Socket';
import { BACKEND, Strings } from 'support/Constants';

import { Section, SectionHeader } from 'components/Section';
import { BanInfoCard } from 'components/Card';
import Loader from 'components/Loader';

const Banned = ({ history }) => {
  const { lang } = useContext(StoreContext)
  const [userId] = useState(localStorage.getItem('ban'))
  const [banInfo, setBanInfo] = useState({})

  useEffect(() => {
    if (!userId) return history.push('/')

    document.title = 'Forum | ' + Strings.youAreBanned[lang]

    const fetchBan = async () => {
      try {
        const data = await fetch(`${BACKEND}/api/ban?userId=${userId}`)
        const response = await data.json()

        if (!response.error) {
          if (!response.ban) {
            localStorage.removeItem('ban')
            history.push('/signin')
          }
          setBanInfo(response.ban)
        } else throw Error(response.error?.message || 'Error')
      } catch(err) {
        console.error(err)
      }
    }

    fetchBan()
  }, [userId, lang, history])

  useEffect(() => {
    let timer
    if (banInfo.expiresAt) {
      timer = setInterval(() => {
        if (banInfo.expiresAt < new Date().toISOString()) {
          localStorage.removeItem('ban')
          history.push('/signin')
        }
      }, 1000)
    }
    return () => {
      timer && clearInterval(timer)
    }
  }, [banInfo, history])

  useEffect(() => {
    if (userId) joinToRoom('banned:' + userId)
    return () => {
      if (userId) leaveFromRoom('banned:' + userId)
    }
  }, [userId])

  useEffect(() => {
    Socket.on('unban', (data) => {
      localStorage.removeItem('ban')
      history.push('/signin')
    })
  }, [history])

  return (
    <Section>
      <SectionHeader title={Strings.youAreBanned[lang]} />

      {banInfo.createdAt
        ? <BanInfoCard data={banInfo} owner />
        : <Loader className="more_loader" color="#64707d" />
      }
    </Section>
  )
}

export default Banned;

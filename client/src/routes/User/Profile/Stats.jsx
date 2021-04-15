import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { counter } from 'support/Utils';
import { BACKEND, Strings } from 'support/Constants';

import { CardBody } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const Stats = ({ userData, lang, token }) => {
  const [userStats, setUserStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [noData, setNoData] = useState(false)

  useEffect(() => {
    setLoading(true)

    const fetchStats = async () => {
      try {
        const data = await fetch(`${BACKEND}/api/user/stats?userId=${userData._id}`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
        const response = await data.json()

        if (!response.error) {
          setUserStats(response)
          setLoading(false)
          setNoData(false)
        } else throw Error(response.error?.message || 'Error')
      } catch(err) {
        setNoData(true)
        setLoading(false)
      }
    }

    fetchStats()
    // eslint-disable-next-line
  }, [userData._id])

  return !noData ? (
    !loading ? (
      <CardBody>
        <div className="profile_stats_grid">
          <Link to={'/user/' + userData.name + '/threads'} className="profile_stats_item">
            <span className="secondary_text">{Strings.threads[lang]}</span>
            {counter(userStats.threadsCount)}
          </Link>
          <Link to={'/user/' + userData.name + '/answers'} className="profile_stats_item">
            <span className="secondary_text">{Strings.answers[lang]}</span>
            {counter(userStats.answersCount)}
          </Link>
          <Link to={'/user/' + userData.name + '/bans'} className="profile_stats_item">
            <span className="secondary_text">{Strings.bans[lang]}</span>
            {counter(userStats.bansCount)}
          </Link>
          <div className="profile_stats_item">
            <span className="secondary_text">{Strings.karma[lang]}</span>
            <span className={userStats.karma > 0 ? 'positive' : userStats.karma < 0 ? 'negative' : ''}>
              {counter(userStats.karma)}
            </span>
          </div>
        </div>
      </CardBody>
    ) : <Loader className="more_loader" color="#64707d" />
  ) : (
    <Errorer message={Strings.unableToDisplayProfileInfo[lang]} />
  )
}

export default Stats;

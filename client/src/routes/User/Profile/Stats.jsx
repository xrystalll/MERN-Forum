import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { BACKEND, Strings } from 'support/Constants';

import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

const Stats = ({ userData, lang, token }) => {
  const [init, setInit] = useState(true)
  const [userStats, setUserStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [noData, setNoData] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await fetch(`${BACKEND}/api/user/stats?userId=${userData._id}`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
        const response = await data.json()

        if (!response.error) {
          setInit(false)
          setUserStats(response)
          setLoading(false)
          setNoData(false)
        } else throw Error(response.error?.message || 'Error')
      } catch(err) {
        setInit(false)
        setNoData(true)
        setLoading(false)
      }
    }

    init && fetchStats()
  }, [init])

  return !noData ? (
    !loading ? (
      <div className="card_item">
        <div className="card_body">
          <div className="card_block">
            <div className="profile_stats_grid">
              <Link to={'/user/' + userData.name + '/threads'} className="profile_stats_item">
                <span className="secondary_text">{Strings.threads[lang]}</span>
                {userStats.threadsCount}
              </Link>
              <Link to={'/user/' + userData.name + '/answers'} className="profile_stats_item">
                <span className="secondary_text">{Strings.answers[lang]}</span>
                {userStats.answersCount}
              </Link>
              <Link to={'/user/' + userData.name + '/bans'} className="profile_stats_item">
                <span className="secondary_text">{Strings.bans[lang]}</span>
                {userStats.bansCount}
              </Link>
            </div>
          </div>
        </div>
      </div>
    ) : <Loader className="more_loader" color="#64707d" />
  ) : (
    <Errorer message={Strings.unableToDisplayProfileInfo[lang]} />
  )
}

export default Stats;

import { useContext, useEffect, useState } from 'react';
import { NavLink, Switch, Redirect, Route, useRouteMatch } from 'react-router-dom';
import { toast } from 'react-toastify';

import { StoreContext } from 'store/Store';

import { BACKEND, Strings } from 'support/Constants';

import { Section, SectionHeader } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import { SlidesContainer, SlideItem } from 'components/Slider';

import Boards from './Boards';
import Bans from './Bans';
import './style.css';

const Dashboard = () => {
  const { setFabVisible, lang } = useContext(StoreContext)
  document.title = 'Forum | ' + Strings.adminDashboard[lang]
  const { path } = useRouteMatch()
  const [stats, setStats] = useState([])

  useEffect(() => {
    setFabVisible(false)
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await fetch(BACKEND + '/api/stats')
        const response = await data.json()

        if (!response.error) {
          setStats(response)
        } else throw Error(response.error?.message || 'Error')
      } catch(err) {
        toast.error(err.message)
      }
    }

    fetchStats()
  }, [])

  return (
    <Section>
      <Switch>
        <Route path={path + '/boards'} exact component={Boards} />
        <Route path={path + '/bans'} component={Bans} />
        <Route path={path} exact>
          <Breadcrumbs current={Strings.dashboard[lang]} links={[
            { title: Strings.home[lang], link: '/' }
          ]} />

          <SectionHeader title={Strings.adminDashboard[lang]} />

          {stats.length ? (
            <SlidesContainer>
              {stats.map(item => (
                <SlideItem key={item._id} title={item.title} count={item.count} />
              ))}
            </SlidesContainer>
          ) : null}

          <div className="admin__nav">
            <NavLink to={path + '/boards'} className="admin__nav_item">
              <i className="bx bx-category" />
              {Strings.boards[lang]}
            </NavLink>

            <NavLink to={path + '/admins'} className="admin__nav_item">
              <i className="bx bx-group" />
              {Strings.admins[lang]}
            </NavLink>

            <NavLink to={path + '/reports'} className="admin__nav_item">
              <i className="bx bxs-flag-alt" />
              {Strings.reports[lang]}
            </NavLink>

            <NavLink to={path + '/bans'} className="admin__nav_item">
              <i className="bx bx-block" />
              {Strings.bans[lang]}
            </NavLink>
          </div>
        </Route>
        <Route>
          <Redirect to={path} />
        </Route>
      </Switch>
    </Section>
  )
}

export default Dashboard;

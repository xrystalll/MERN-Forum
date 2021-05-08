import { useContext, useEffect, useState } from 'react';
import { NavLink, Switch, Redirect, Route, useRouteMatch } from 'react-router-dom';
import { toast } from 'react-toastify';

import { StoreContext } from 'store/Store';

import { BACKEND, Strings } from 'support/Constants';

import { Section, SectionHeader } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import { ControlledSlider, SlideItem } from 'components/Slider';

import Boards from './Boards';
import Admins from './Admins';
import Reports from './Reports';
import Bans from './Bans';
import Folders from './Folders';
import Files from './Files';
import SearchAuth from './SearchAuth';
import './style.css';

const Dashboard = () => {
  const { user, setFabVisible, lang } = useContext(StoreContext)
  document.title = 'Forum | ' + Strings.adminDashboard[lang]
  const { path } = useRouteMatch()
  const [stats, setStats] = useState([])

  useEffect(() => {
    setFabVisible(false)
    // eslint-disable-next-line
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
        toast.error(err.message === '[object Object]' ? 'Error' : err.message)
      }
    }

    fetchStats()
  }, [])

  return (
    <Section>
      <Switch>
        {user.role === 3 && <Route path={path + '/boards'} exact component={Boards} />}
        {user.role === 3 && <Route path={path + '/admins'} exact component={Admins} />}
        <Route path={path + '/reports'} component={Reports} />
        <Route path={path + '/bans'} component={Bans} />
        {user.role === 3 && <Route path={path + '/folders'} component={Folders} />}
        <Route path={path + '/files'} component={Files} />
        <Route path={path + '/searchauth'} component={SearchAuth} />
        <Route path={path} exact>
          <Breadcrumbs current={Strings.dashboard[lang]} links={[
            { title: Strings.home[lang], link: '/' }
          ]} />

          <SectionHeader title={Strings.adminDashboard[lang]} />

          {stats.length ? (
            <ControlledSlider
              items={stats}
              card={SlideItem}
            />
          ) : null}

          <div className="admin__nav">
            {user.role === 3 && (
              <NavLink to={path + '/boards'} className="admin__nav_item">
                <i className="bx bx-category" />
                {Strings.boards[lang]}
              </NavLink>
            )}

            {user.role === 3 && (
              <NavLink to={path + '/admins'} className="admin__nav_item">
                <i className="bx bx-group" />
                {Strings.admins[lang]}
              </NavLink>
            )}

            <NavLink
              to={path + '/reports'}
              className={!!localStorage.getItem('reports') ? 'admin__nav_item new' : 'admin__nav_item'}
            >
              <i className="bx bxs-flag-alt" />
              {Strings.reports[lang]}
            </NavLink>

            <NavLink to={path + '/bans'} className="admin__nav_item">
              <i className="bx bx-block" />
              {Strings.bans[lang]}
            </NavLink>

            {user.role === 3 && (
              <NavLink to={path + '/folders'} className="admin__nav_item">
                <i className="bx bx-folder" />
                {Strings.uploadsFolders[lang]}
              </NavLink>
            )}

            <NavLink
              to={path + '/files'}
              className={!!localStorage.getItem('files') ? 'admin__nav_item new' : 'admin__nav_item'}
            >
              <i className="bx bx-file-blank" />
              {Strings.moderateFiles[lang]}
            </NavLink>

            <NavLink to={path + '/searchauth'} className="admin__nav_item">
              <i className="bx bx-search" />
              {Strings.authorizationsHistory[lang]}
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

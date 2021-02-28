import { useContext, useEffect, useState } from 'react';
import { NavLink, Switch, Redirect, Route, useRouteMatch } from 'react-router-dom';

import { StoreContext } from 'store/Store';

import { Section, SectionHeader } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import { SlidesContainer, SlideItem } from 'components/PopularBoards';

import Boards from './Boards';
import './style.css';

const Dashboard = () => {
  document.title = 'Forum | Admin dashboard'
  const { setFabVisible } = useContext(StoreContext)
  const { path } = useRouteMatch()

  useEffect(() => {
    setFabVisible(false)
  }, [])

  // mock data
  const [stats] = useState([
    {
      id: 1,
      title: 'Users',
      count: 99
    }, {
      id: 2,
      title: 'Boards',
      count: 12
    }, {
      id: 3,
      title: 'Threads',
      count: 145
    }, {
      id: 4,
      title: 'Answers',
      count: 313
    }, {
      id: 5,
      title: 'Bans',
      count: 32
    }
  ])

  return (
    <Section>
      <Switch>
        <Route path={path + '/boards'} exact component={Boards} />
        <Route path={path} exact>
          <Breadcrumbs current="Dashboard" links={[
            { title: 'Home', link: '/' }
          ]} />

          <SectionHeader title="Admin dashboard" />

          <SlidesContainer>
            {stats.map(item => (
              <SlideItem key={item.id} title={item.title} count={item.count} />
            ))}
          </SlidesContainer>

          <div className="admin__nav">
            <NavLink to={path + '/boards'} className="admin__nav_item">
              <i className="bx bx-category"></i>
              Boards
            </NavLink>

            <NavLink to={path + '/admins'} className="admin__nav_item">
              <i className="bx bx-group"></i>
              Admins
            </NavLink>

            <NavLink to={path + '/reports'} className="admin__nav_item">
              <i className="bx bxs-flag-alt"></i>
              Reports
            </NavLink>

            <NavLink to={path + '/bans'} className="admin__nav_item">
              <i className="bx bx-block"></i>
              Bans
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

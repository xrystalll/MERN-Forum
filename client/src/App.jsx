import { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Store from 'store/Store';

import Layout from 'components/Layout';
import { GeneralRoute, AuthRoute, UsersOnlyRoute, AdminsOnlyRoute } from 'components/ProtectedRoute';

import Home from 'routes/Home';
import SignUp from 'routes/Auth/SignUp';
import SignIn from 'routes/Auth/SignIn';
import Boards from 'routes/Forum/Boards';
import Board from 'routes/Forum/Board';
import Thread from 'routes/Forum/Thread';
import Users from 'routes/Users';
import User from 'routes/User';
import Banned from 'routes/Banned';
import Dashboard from 'routes/Dashboard';
import { NotFound } from 'routes/Error';
import { ToastContainer } from 'react-toastify';

const App = () => {
  useEffect(() => {
    if (localStorage.getItem('theme') === 'light') {
      document.body.classList.add('light')
      document.querySelector('meta[name="theme-color"]').setAttribute('content', '#eef0f1')
    }
  }, [])

  return (
    <Store>
      <Router>
        <Layout>
          <Switch>
            <GeneralRoute exact path="/" component={Home} />
            <AuthRoute path="/signup" component={SignUp} />
            <AuthRoute path="/signin" component={SignIn} />
            <GeneralRoute exact path="/boards" component={Boards} />
            <GeneralRoute path="/boards/:boardName" component={Board} />
            <GeneralRoute path="/thread/:threadId" component={Thread} />
            <GeneralRoute path="/users" component={Users} />
            <UsersOnlyRoute path="/user/:userName" component={User} />
            <AdminsOnlyRoute path="/dashboard" component={Dashboard} />
            <Route path="/banned" component={Banned} />
            <Route path="*" component={NotFound} status={404} />
          </Switch>

          <ToastContainer position="bottom-right" autoClose={2000} pauseOnFocusLoss={false} />
        </Layout>
      </Router>
    </Store>
  )
}

export default App;

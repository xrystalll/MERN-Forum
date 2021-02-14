import { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Store from 'store/Store';

import Layout from 'components/Layout';
import CustomScrollbar from 'components/CustomScrollbar';
import { AuthRoute } from 'components/ProtectedRoute';

import Home from 'routes/Home';
import SignUp from 'routes/Auth/SignUp';
import SignIn from 'routes/Auth/SignIn';
import Boards from 'routes/Forum/Boards';
import Board from 'routes/Forum/Board';
import Thread from 'routes/Forum/Thread';
import Users from 'routes/Users';
import User from 'routes/User';
import Notifications from 'routes/Notifications';
import { NotFound } from 'routes/Error';

const App = () => {
  useEffect(() => {
    if (localStorage.getItem('theme') === 'light') {
      document.body.classList.add('light')
    }
  }, [])

  return (
    <Store>
      <Router>
        <CustomScrollbar className="view">
          <Layout>
            <Switch>
              <Route exact path="/" component={Home} />
              <AuthRoute path="/signup" component={SignUp} />
              <AuthRoute path="/signin" component={SignIn} />
              <Route exact path="/boards" component={Boards} />
              <Route path="/boards/:boardId" component={Board} />
              <Route path="/thread/:threadId" component={Thread} />
              <Route path="/users" component={Users} />
              <Route path="/user/:userId" component={User} />
              <Route path="/notifications" component={Notifications} />
              <Route path="*" component={NotFound} status={404} />
            </Switch>
          </Layout>
        </CustomScrollbar>
      </Router>
    </Store>
  )
};

export default App;

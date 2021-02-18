import { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Store from 'store/Store';

import Layout from 'components/Layout';
import { AuthRoute } from 'components/ProtectedRoute';

import Home from 'routes/Home';
import SignUp from 'routes/Auth/SignUp';
import SignIn from 'routes/Auth/SignIn';
import Boards from 'routes/Forum/Boards';
import Board from 'routes/Forum/Board';
import Thread from 'routes/Forum/Thread';
import Users from 'routes/Users';
import User from 'routes/User';
import { NotFound } from 'routes/Error';

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
            <Route exact path="/" component={Home} />
            <AuthRoute path="/signup" component={SignUp} />
            <AuthRoute path="/signin" component={SignIn} />
            <Route exact path="/boards" component={Boards} />
            <Route path="/boards/:boardId" component={Board} />
            <Route path="/thread/:threadId" component={Thread} />
            <Route path="/users" component={Users} />
            <Route path="/user/:userId" component={User} />
            <Route path="*" component={NotFound} status={404} />
          </Switch>
        </Layout>
      </Router>
    </Store>
  )
};

export default App;

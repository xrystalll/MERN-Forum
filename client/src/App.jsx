import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Store from 'store/Store';

import Layout from 'components/Layout';
import AuthRoute from 'components/AuthRoute';

import Home from 'routes/Home';
import SignUp from 'routes/SignUp';
import SignIn from 'routes/SignIn';
import Boards from 'routes/Boards';
import Board from 'routes/Board';
import Thread from 'routes/Thread';
import User from 'routes/User';
import { NotFound } from 'routes/Error';

const App = () => {
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
            <Route path="/user/:userId" component={User} />
            <Route path="*" component={NotFound} status={404} />
          </Switch>
        </Layout>
      </Router>
    </Store>
  )
};

export default App;

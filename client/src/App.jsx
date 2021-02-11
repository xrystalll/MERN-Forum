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
import User from 'routes/User';
import { NotFound } from 'routes/Error';

const App = () => {
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
              <Route path="/user/:userId" component={User} />
              <Route path="*" component={NotFound} status={404} />
            </Switch>
          </Layout>
        </CustomScrollbar>
      </Router>
    </Store>
  )
};

export default App;

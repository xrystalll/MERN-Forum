import { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Store from 'store/Store';

import Layout from 'components/Layout';
import { GeneralRoute, AuthRoute, UsersOnlyRoute, AdminsOnlyRoute } from 'components/ProtectedRoute';

import Home from 'routes/Home';
import SignUp from 'routes/Auth/SignUp';
import SignIn from 'routes/Auth/SignIn';
import Search from 'routes/Search';
import Boards from 'routes/Forum/Boards';
import Board from 'routes/Forum/Board';
import Thread from 'routes/Forum/Thread';
import Users from 'routes/Users';
import Admins from 'routes/Users/Admins';
import User from 'routes/User';
import Banned from 'routes/Banned';
import Dashboard from 'routes/Dashboard';
import Folders from 'routes/Uploads/Folders';
import Folder from 'routes/Uploads/Folder';
import File from 'routes/Uploads/File';
import Messages from 'routes/Messages';
import { NotFound } from 'routes/Error';

const App = () => {
  useEffect(() => {
    if (localStorage.getItem('theme') === 'light') {
      document.body.classList.add('light')
      document.querySelector('meta[name="theme-color"]').setAttribute('content', '#eef0f1')
      document.querySelector('meta[name="color-scheme"]').setAttribute('content', 'light dark')
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
            <GeneralRoute path="/search" component={Search} />
            <GeneralRoute exact path="/boards" component={Boards} />
            <GeneralRoute path="/boards/:boardName" component={Board} />
            <GeneralRoute path="/thread/:threadId" component={Thread} />
            <GeneralRoute path="/users" component={Users} />
            <UsersOnlyRoute path="/user/:userName" component={User} />
            <GeneralRoute path="/admins" component={Admins} />
            <AdminsOnlyRoute path="/dashboard" component={Dashboard} />
            <GeneralRoute exact path="/uploads" component={Folders} />
            <GeneralRoute path="/uploads/:folderName" component={Folder} />
            <GeneralRoute path="/file/:fileId" component={File} />
            <UsersOnlyRoute path="/messages" component={Messages} />
            <Route path="/banned" component={Banned} />
            <Route path="*" component={NotFound} status={404} />
          </Switch>
        </Layout>
      </Router>

      <ToastContainer position="bottom-right" autoClose={2000} pauseOnFocusLoss={false} />
    </Store>
  )
}

export default App;

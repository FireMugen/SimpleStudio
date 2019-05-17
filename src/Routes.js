import React, { Component } from 'react';
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import fire from './config/Fire';
import Room from './components/studio/Room';
import Chat from './components/Chat';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';

class Routes extends Component{
  constructor() {
    super();
    this.state = ({
      user: null,
    });
    this.authListener = this.authListener.bind(this);
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
        localStorage.setItem('user', user.uid);
      } else {
        this.setState({ user: null });
        localStorage.removeItem('user');
      }
    });
  }

  render() {
    return (
      <Router>
        <div>
          {
            !this.state.user ? <Switch>
              <Route exact path='/' component={ Login } />,
              <Redirect from='/:room' to='/' />
            </Switch> : <Switch>
              <Route exact path='/' component={ Home } />,
              <Route path='/profile' component={ Profile } />,
              <Route path='/:room' component={ Room } />
            </Switch>
          }
        </div>
      </Router>
   );
  }

}

export default Routes

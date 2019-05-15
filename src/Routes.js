import React, { Component } from 'react';
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import fire from './config/Fire';
import Room from './components/studio/Room';
import Chat from './components/Chat';
import NavBar from './components/NavBar';
import Login from './components/Login';
import Home from './components/Home';


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
          <Route exact path='/' component={this.state.user ? Home : Login } />
          <Route path='/:room' component={ Room } />

        </div>
      </Router>
   );
  }

}

export default Routes

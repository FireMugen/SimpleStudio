import React, { Component } from 'react';
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import fire from './config/Fire';
import Room from './components/studio/Room';
import Chat from './components/Chat';
import NavBar from './components/NavBar';
import Login from './components/Login';
import Home from './components/Home';
<<<<<<< HEAD
import Profile from './components/Profile';
=======
import Profile from './components/Profile'

>>>>>>> 4f3f1656527df3cbd2146e77790b41c73e011ce1

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
							<Route path='/profile/:user' component={ Profile } />,
              <Route exact path='/' component={ Home } />,
              <Route path='/profile/:user' component={ Profile } />,
              <Route path='/:room' component={ Room } />
            </Switch>
          }
        </div>
      </Router>
   );
  }

}

export default Routes

import React, { Component } from 'react';
import './App.scss';
import fire from './config/Fire';
import Room from './components/studio/Room';
import Chat from './components/Chat';
import NavBar from './components/NavBar';
import Login from './components/Login';
import Home from './components/Home';

class App extends Component {
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
     <div className="App">
		 {this.state.user ? ( <Home />) : (<Login />)}
		 </div>
	 );
 }
}

 export default App;

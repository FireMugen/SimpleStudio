import React, { Component } from 'react';
import '../App.css';
import fire from '../config/Fire';
import Home from './Home';
import Login from './Login';
import Test from './Test';
import Sequencer from './studio/Sequencer'


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
	      <Sequencer />
	   </div>

	 );
 }
}

 export default App;

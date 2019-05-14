import React, { Component } from 'react';
import './App.css';
import fire from './config/Fire';
import Room from './components/studio/Room';
import Chat from './components/Chat'

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
		     <Room />
         <Chat />
		 </div>
	 );
 }
}

 export default App;

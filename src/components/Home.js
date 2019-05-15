import React, { Component } from 'react';
import fire from '../config/Fire';
import NavBar from './NavBar'
import Room from './studio/Room'
import '../css/login.scss'


class Home extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
				const user = fire.auth().currentUser;
				this.state = {
					userName: user.displayName,
					email: user.email
		    };
    }

    logout() {
        fire.auth().signOut();
    }


    render() {
        return (
					<div>
					<NavBar />
					<h1 className="mrow">Simple Studio</h1>
					<h2 className="mrow">Welcome &nbsp;{this.state.userName}</h2>
					<h2 className="mrow">Email: &nbsp;{this.state.email}</h2>
					<button onClick={this.logout}>Logout</button>
					</div>
				);

		}
}

export default Home;

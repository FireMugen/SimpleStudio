import React, { Component } from 'react';
import fire from '../config/Fire';
import NavBar from './NavBar'

class Home extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }


    logout() {
        fire.auth().signOut();
    }

    render() {
        return (
					<div>
					<NavBar />
					<h1>Simple Studio</h1>
					<button onClick={this.logout}>Logout</button>
					</div>
				);

		}

}

export default Home;

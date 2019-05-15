import React, { Component } from 'react';
import fire from '../config/Fire';
import NavBar from './NavBar'
import Room from './studio/Room'
import RoomForm from './crudForms/RoomForm'
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
					<div className="background">
					<h1 className="mrow">Simple Studio</h1>
					<br/>
					<h2 className="mrow">Welcome &nbsp;{this.state.userName}</h2>
					<br/>
					<button class="box-button">Create Room</button>
					<button class="box-button">Join Room</button>
					<button class="box-button">Spectate</button>
					<br/>
					<div><aside><RoomForm /></aside></div>
					<button onClick={this.logout} className="button">Logout</button>
					</div>
				);
		}
}

export default Home;

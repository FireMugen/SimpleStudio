import React, { Component } from 'react';
import fire from '../config/Fire';
import NavBar from './NavBar'
import Room from './studio/Room'
import RoomForm from './crudForms/RoomForm'
import JoinRoom from './JoinRoom'
import RoomLinks from './RoomLinks'
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
					<br/>
					<h1 className="mrow">Simple Studio</h1>
					<br/>
					<h2 className="mrow">Welcome &nbsp;{this.state.userName}</h2>
					<br/>
					<div className="container">
					<div>
						<button className="box-button">Create</button>
						<br/>
						<button className="box-button">Join Room</button>
						<br/>
						<button className="box-button">Spectate</button>
					</div>
					<RoomForm />
					</div>
					<button onClick={this.logout} className="button">Logout</button>
					</div>

				);
		}
}

export default Home;

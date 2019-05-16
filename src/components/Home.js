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
					email: user.email,
          roomForm: false,
          roomLinks: false,
          joinRoom: false
		    };

        this._onCreate = this._onCreate.bind(this)
        this._onJoin = this._onJoin.bind(this)
        this._onCollab = this._onCollab.bind(this)
    }

    logout() {
        fire.auth().signOut();
    }


    _onCreate(){
      this.setState({
        roomForm: true,
        roomLinks: false,
        joinRoom: false
      })
    }

    _onJoin(){
      this.setState({
        roomForm: false,
        roomLinks: false,
        joinRoom: true
      })
    }

    _onCollab(){
      this.setState({
        roomForm: false,
        roomLinks: true,
        joinRoom: false
      })
    }


    render() {
        return (
					<div className="background">
					<h1 className="mrow">Simple Studio</h1>
					<h2 className="mrow">Welcome {this.state.userName}</h2>
					<br/>
					<div className="container">
					<div></div>
					<div>
						<button onClick={this._onCreate} className="box-button">Create</button>
						<br/>
						<button onClick={this._onJoin} className="box-button">Join Room</button>
						<br/>
						<button onClick={this._onCollab} className="box-button">Collaborate</button>
					</div>
					{ this.state.roomForm ? <RoomForm /> : "" }
					{ this.state.roomLinks ? <RoomLinks /> : "" }
					{ this.state.joinRoom ? <JoinRoom /> : "" }
					<div></div>
					</div>
					<button onClick={this.logout} className="button">Logout</button>
					</div>
				);
		}
}

export default Home;

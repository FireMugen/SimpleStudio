import React, { Component } from 'react';
import fire from '../config/Fire';
import RoomForm from './crudForms/RoomForm'
import JoinRoom from './JoinRoom'
import RoomLinks from './RoomLinks'
import Tone from 'tone'
import { Link } from 'react-router-dom'
import '../css/login.scss'

class Home extends Component {
    constructor(props) {
        super(props);

        //stops the song from a potential previous room from playing and cancel the loop attached
        Tone.Transport.stop();
        Tone.Transport.cancel();


				const user = fire.auth().currentUser;
				console.log(user);
				this.state = {
					userName: user.displayName,
					email: user.email,
          roomForm: false,
          roomLinks: false,
          joinRoom: false,
					initial: this.userNameShorten
		    };

        this.logout = this.logout.bind(this);

        this._onCreate = this._onCreate.bind(this)
        this._onJoin = this._onJoin.bind(this)
        this._onCollab = this._onCollab.bind(this)
    }

    //logout
    logout() {
        fire.auth().signOut();
    }

    //_on buttons open a different React Component
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
			let letter = '';
			if (this.state.userName){
				 letter = this.state.userName.charAt(0).toUpperCase()
				 console.log(1, letter);
			}
			console.log(2, letter);

        return (
					<div className="background">
					<Link className="" to='/profile'><div className="profile-link">
						{ letter }</div></Link>
					<h1 className="mrow">Simple Studio</h1>
					<br/>
					<div className="container">
					<div></div>
					<div>
						<button onClick={this._onCreate} className="box-button">Create</button>
						<br/>
						<button onClick={this._onJoin} className="box-button">Join Room</button>
						<br/>
						<button onClick={this._onCollab} className="box-button">Your Rooms</button>
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

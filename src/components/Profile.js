import React, { Component } from 'react';
import fire from '../config/Fire';
import '../css/login.scss'
import Popup from "reactjs-popup";

class Profile extends Component {
	constructor(props) {
			super(props);

			this.deleteUser = this.deleteUser.bind(this);
			this.handleChange = this.handleChange.bind(this);
			this.submit = this.submit.bind(this);
			this.authUser = this.authUser.bind(this);

			this.state = {
				userName: '',
				email: '',
				password: ''
			};
	}

	handleChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	submit(s){
		s.preventDefault();
		const user = fire.auth().currentUser;
		if(user){
			user.updateProfile({
  			displayName: this.state.userName,
			}).then( (u) => {
  			console.log("Update Successful")
			}).catch( (error) => {
				console.log(error)
			});
		}
	}

	authUser(c){
		c.preventDefault();

		const user = fire.auth().currentUser;
		// Prompt the user to re-provide their sign-in credentials
		user.reauthenticateWithCredential(this.state.email, this.state.password).then( () => {
			// User re-authenticated.
				user.delete()
		}).catch(function(error) {
			// An error happened.
		});
	}

	deleteUser(d){
		d.preventDefault()
		const user = fire.auth().currentUser;
		user.delete().then( () => {
		  // User deleted.
		}).catch(function(error) {
		  // An error happened.
		});
	}

	render(){
		return(
			<div className="background">
			<a href="/#/"><div className="home-link">⏮️</div></a>
			<h1 className="mrow">Update Profile &nbsp;</h1>
			<form className="sign-form" onSubmit={this.submit}>
				<div>
					<label className="title">Change User Name</label>
					<br/>
					<input className="input" value={this.state.userName} onChange={this.handleChange} type="userName" 	name="userName" placeholder="User Name" />
				</div>
				<div>
					<label className="title">Change Email address</label>
					<br/>
					<input className="input" value={this.state.email} onChange={this.handleChange} type="email" name="email" placeholder="Enter email" />
				</div>
				<div>
					<label className="title">Change Password</label>
					<br/>
					<input className="input" value={this.state.password} onChange={this.handleChange} type="password" name="password" placeholder="Password" />
				</div>
					<button className="button" type="submit">Update Profile</button>
			</form>
				<button className="button" onClick={this.deleteUser}>Delete Account</button>
			</div>
		)
	}
}

export default Profile;

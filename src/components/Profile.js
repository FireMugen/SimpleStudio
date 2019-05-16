import React, { Component } from 'react';
import fire from '../config/Fire';
import '../css/login.scss'


class Profile extends Component {
	constructor(props) {
			super(props);
			const user = fire.auth().currentUser;
			this.state = {
				userName: user.displayName,
				email: user.email,
				password: user.password
			};
	}

	handleChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}


	render(){
		return(
			<div>
			<form className="sign-form">
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
					<button className="button" type="submit" onClick={this.login}>Update Profile</button>
			</form>
			</div>
		)
	}
}

export default Profile

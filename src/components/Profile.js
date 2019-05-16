import React, { Component } from 'react';
import fire from '../config/Fire';
import '../css/login.scss'
import fire from '../config/Fire';

class Profile extends Component {
	constructor(props) {
			super(props);

			this.handleChange = this.handleChange.bind(this);
			this.submit = this.submit.bind(this);

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



	render(){
		return(
			<div className="background">
			<a href="/#/"><div className="profile-link">Home</div></a>
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
			</div>
		)
	}
}

<<<<<<< HEAD
export default Profile;
=======
export default Profile
>>>>>>> 4f3f1656527df3cbd2146e77790b41c73e011ce1

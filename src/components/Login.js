import React, { Component } from 'react';
import Popup from "reactjs-popup";
import fire from '../config/Fire';
import '../css/login.scss'


class Login extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
		this.signup = this.signup.bind(this);

    this.state = {
      email: '',
      password: '',
			userName: '',
    };
  }

	mrow(m){
	fire.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log(user)
  }
});
}

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  login(e) {
    e.preventDefault();
    fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{console.log()
    }).catch((error) => {
        console.log(error);
      });
  }

	signup(e){
	e.preventDefault();
<<<<<<< HEAD
	fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(
  	(data)=>{
			const { user } = data
    	if(user){
      	user.updateProfile({
         displayName: this.state.userName
      }).then(function() {
			console.log(user.displayName);
=======
	fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{console.log(u)
	})
	fire.firestore().collection('user').doc(this.state.userName).update({

	})
	.catch((error) => {
			console.log(error);
>>>>>>> d4bf0944e47f629a3d37486e592b37e9039b8a14
		})
    }
}).catch((error) => {
			console.log(error);
		});
	}


render() {
	return (
<<<<<<< HEAD
		<div className="background">
=======
		<div className="loginContainer">
>>>>>>> d4bf0944e47f629a3d37486e592b37e9039b8a14
			<h1 className="title">Simple Studio</h1>
		 	<form className="sign-form">
				<div>
		 			<label className="title" >Email address</label>
					<br/>
		 			<input className="input" value={this.state.email} onChange={this.handleChange} type="email" name="email" placeholder="Enter email" />
				</div>
		 		<div>
					<label className="title">Password</label>
					<br/>
					<input className="input" value={this.state.password} onChange={this.handleChange} type="password" name="password" placeholder="Password" />
				</div>
					<button className="button" type="submit" onClick={this.login}>Login</button>
			</form>
				<p className="title">Not a member?</p>
				  <Popup className="popup-box" id="signup-box" trigger={<button className="button">Sign Up</button>} position="center">
				    <div>
						<form className="sign-form">
								<div>
									<label className="label-form">User Name</label>
									<br/>
									<input className="input-pop" value={this.state.userName} onChange={this.handleChange} type="name" name="userName" placeholder="Create a user name" />
									<label className="label-form">Email address</label>
									<br/>
									<input className="input-pop" value={this.state.email} onChange={this.handleChange} type="email" name="email" placeholder="Enter email" />
								</div>
								<div>
									<label className="label-form">Password</label>
									<br/>
									<input className="input-pop" value={this.state.password} onChange={this.handleChange} type="password" name="password"	placeholder="Password" />
								</div>
									<br/>
									<button className="button" onClick={this.signup}>Sign Up</button>
						</form>
							<br/>
						</div>
				  </Popup>
</div>
	);
}
}

export default Login;

import React, {Component} from 'react';
import '../css/navbar.css'


class NavBar extends Component {

	render(){
		return(
			<div>
				<nav className="NavBar">
					<ul>
						<li><a href="#">Home</a></li>
						<li><a href="#">Rooms</a></li>
						<li><a href="#">Profile</a></li>
					</ul>
				</nav>
			</div>
		)
	}

}

export default NavBar;

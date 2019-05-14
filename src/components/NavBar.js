import React, {Component} from 'react';
import '../css/navbar.scss'


class NavBar extends Component {

	render(){
		return(
			<div className="NavBox">
				<nav>
					<ul className="NavBar">
						<a href="#">Home</a>
						<a href="/Room">Rooms</a>
						<a href="#">Profile</a>
					</ul>
				</nav>
			</div>
		)
	}

}

export default NavBar;

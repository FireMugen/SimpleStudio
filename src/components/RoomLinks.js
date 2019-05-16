import React, {Component} from 'react';
import fire from '../config/Fire';

//TODO inefficient to loop through all room documents looking for userid, need roomIDs in users too
class RoomLinks extends Component{
  constructor(){
    super()
    this.state = {

    }
  }

  generateRoomLinks(){
    const links = [];

  }

  render(){
    return(
      <div>
        {this.generateRoomLinks}
      </div>
    )
  }
}

export default RoomLinks;

import React, {Component} from 'react';
import fire from '../config/Fire';
import { Link } from 'react-router-dom'

//TODO inefficient to loop through all room documents looking for userid, need roomIDs in users too
class RoomLinks extends Component{
  constructor(){
    super()
    this.state = {
      roomIDs: [],
      rooms: []
    }
  }

  componentDidMount(){
    const userID = fire.auth().currentUser.uid;

    fire.firestore().collection('user').doc(userID).get().then( (result) => {

      this.setState({
        roomIDs: result.data().rooms
      })

      this.generateLinks();

    })

  }

  generateLinks(){
    const roomIDs = this.state.roomIDs
    const roomLinks = [];

    Promise.all(roomIDs.map( async (id) => {

      await fire.firestore().collection('room').doc(id).get().then( (result) => {
        roomLinks.push(<p><Link className="" to={`/${result.id}`}>{result.data().name}</Link></p>)

      })

    })).then( () => {
      this.setState({
        rooms: roomLinks
      });
    })

  }

  render(){
    return(
      <div className="form-style">
        <div className="room-wrapper">
          {this.state.rooms}
        </div>
      </div>
    )
  }
};

export default RoomLinks;

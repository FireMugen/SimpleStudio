import React, {Component} from 'react';
import fire from '../config/Fire';
import { Link } from 'react-router-dom'

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

    //Get all rooms and store them
    Promise.all(roomIDs.map( async (id) => {

      await fire.firestore().collection('room').doc(id).get().then( (result) => {
        //create the links to store them as
        roomLinks.push(<p><Link className="" to={`/${result.id}`}>{result.data().name}</Link></p>)

      })

    })).then( () => {
      //pass them through state
      this.setState({
        rooms: roomLinks
      });
    })

  }

  render(){
    return(
      <div>
      <div className="form-style">
        <div className="room-wrapper">
          {this.state.rooms}
        </div>
      </div>
      </div>
    )
  }
};

export default RoomLinks;

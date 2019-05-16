import React, {Component} from 'react';
import fire from '../config/Fire';
import { Link } from 'react-router-dom'

//TODO inefficient to loop through all room documents looking for userid, need roomIDs in users too
class RoomLinks extends Component{
  constructor(){
    super()
    this.state = {
      roomIDs: []
    }
  }

  componentDidMount(){
    const userID = fire.auth().currentUser.uid;

    fire.firestore().collection('user').doc(userID).get().then( (result) => {

      this.setState({
        roomIDs: result.data().rooms
      })

    })


  }

  generateLinks(){
    const roomIDs = this.state.roomIDs
    const roomLinks = [];
    console.log(1);

    roomIDs.forEach( async (id) => {
      console.log(2);

      await fire.firestore().collection('room').doc(id).get().then( (result) => {
        console.log(3);
        roomLinks.push(<Link to={`/${result.id}`}>{result.data().name}</Link>)

      })
      console.log(4, roomLinks);
      return roomLinks;
    })

  }

  render(){
    return(
      <div>
        {this.generateLinks()}
      </div>
    )
  }
};

export default RoomLinks;

import React, {Component} from 'react';
import { Redirect } from 'react-router-dom'
import fire from '../config/Fire';

class JoinRoom extends Component{
  constructor(props){
    super(props)

    const user = fire.auth().currentUser;

    this.state = {
      roomName : "",
      password: "",
      redirectLink: "",
      uid: user.uid
    }

    this._handleName = this._handleName.bind(this);
    this._handlePassword = this._handlePassword.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this.joinRoom = this.joinRoom.bind(this);

  }

  _handleName(e){
    this.setState({
      roomName: e.target.value
    })
  }

  _handlePassword(e){
    this.setState({
      password: e.target.value
    })
  }

  _handleSubmit(e){
    e.preventDefault();

    //When the password and room name are entered
    fire.firestore().collection('room').get().then( (rooms) => {
      rooms.docs.forEach( (doc) => {
        //Check all rooms to see if a room has the same name and password
        if(doc.data().name === this.state.roomName){
          if(doc.data().password === this.state.password){
            //if it does, join it
            this.joinRoom(doc.id, doc.data().collaborators);

          }
        }
      })
    })
  }


  //if it does add user to room list and add room to user list
  joinRoom(id, collab){
    const userID = this.state.uid

    if(collab.includes(userID)){

      this.setState({
        redirectLink: id
      });

      return;

    }


    const newCollabs = collab.slice();
    newCollabs.push( userID );

    fire.firestore().collection('room').doc(id).update({
      collaborators : newCollabs
    }).then( () => {

        fire.firestore().collection('user').doc(userID).get().then( (result) => {

          const roomArr = result.data().rooms.slice();
          roomArr.push( id );

          fire.firestore().collection('user').doc(userID).update({
            rooms: roomArr
          })
        })

    })
  }

  render(){
    if(this.state.redirectLink){
      const link = '/' + this.state.redirectLink
      return <Redirect to={link} />
    }

    return(
      <div className="join-room-wrapper">
      <form className="form-style">
        <br />
        <br />
        <br />
        <label>Room Name</label>
        <input type="text" className="input-home" onChange={ this._handleName } value={ this.state.roomName } />
        <br/>
        <br/>
        <label>Pin Code</label>
        <input type="text" className="input-home" onChange={ this._handlePassword } value={ this.state.password } />

        <input type="submit" className="button" onClick={this._handleSubmit} value="Join Room" />
      </form>
      </div>
    )
  }
}

export default JoinRoom;

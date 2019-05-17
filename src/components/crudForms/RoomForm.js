import React, { Component } from 'react';
import fire from '../../config/Fire'
import SequencerForm from './SequencerForm'
import { Redirect } from 'react-router-dom'
import '../../css/login.scss'

class RoomForm extends Component {
  constructor(){
    super()

    this.state = {
      roomName: "",
      sequName: "",
      selectedRows: false,
      type: "",
      redirectLink: ""
    }

    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleName = this._handleName.bind(this);
    this._handleSequ = this._handleSequ.bind(this);
  }

  _handleName(e){
    this.setState({
      roomName: e.target.value
    })
  }

  _handleSequ(rows, name, type){
    this.setState({
      sequName: name,
      selectedRows: rows,
      type: type
    })
  }

  //Returns random Pin Code for the room
  getPassword(){
    return [...Array(6)].map(i=>(~~(Math.random()*36)).toString(36)).join('').toUpperCase();
  }

  //Alot of asynch requests incoming
  _handleSubmit (e){
    e.preventDefault();

    //If a synth isnt selected return
    if( !this.state.selectedRows){
      return;
    }

    const userID = fire.auth().currentUser.uid;
    const password = this.getPassword();
    const roomName = this.state.roomName;


      const drumRows = [
        "CLAP",
        "CLOSEDHAT",
        "SNARE",
        "COWBELL",
        "CYMBAL",
        "KICK",
        "OPENHIHAT",
        "RIMSHOT"
      ];

      const rows = [];
      //All requests are to Firebase
      //Need to create a row document for each drum instrument and store their ids
      //Promise.all allows waits until all promises are done inside
      Promise.all(drumRows.map( async(instrument) => {

        //By calling asynch above you can get this function to make one asynch request at a time, and pushing them to the array
        await fire.firestore().collection('row').add({

          instrument: instrument,
          tone: [false, false, false, false, false, false, false, false, false, false, false,false,  false, false, false, false]

        }).then( (result) => {

          rows.push( result.id )
        })

        })).then( () => {
          //After the array is full of the rows create the drum sequencer model in firebase

        fire.firestore().collection('sequencer').add({

            name: "Drum Sequencer",
            rows: rows

          }).then( (result) => {
            //store the sequencer ID and crate a Synthesiser
            const sequID = result.id;

            fire.firestore().collection('synthesiser').add({

                name: this.state.sequName,
                row0: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                row1: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                row2: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                row3: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                row4: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                row5: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                row6: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                scale: 'major',
                octave: '4',
                root: 'C',
                type: this.state.type,
                chorus: '0',
                reverb: '0',
                delay: '0',
                volume: '-12'

              }).then( (result) => {

                //Create a room and include both the synthesiser and sequencer ids
                //Add current user as a collaborator
                fire.firestore().collection('room').add({
                  name: roomName,
                  tempo: '90',
                  swing: '0',
                  collaborators: [userID],
                  sequencers: [sequID, result.id],
                  password: password

                }).then( (result) => {
                  //Then update the user with the new roomID
                  const roomID = result.id;
                  fire.firestore().collection('user').doc(userID).get().then( (result) => {

                    const roomArr = result.data().rooms.slice();
                    roomArr.push( roomID );

                    fire.firestore().collection('user').doc(userID).update({
                      rooms: roomArr
                    }).then( () => {
                      //When everything is done set the redirectLink
                      this.setState({
                        redirectLink: roomID
                      })
                    })
                  })
                })
              })

            })
          })



    this.setState({
      roomName: "",
      sequName: "",
      selectedRows: false,
      type: false
    })

  }

  render(){
    //if there is a redirectLink redirect to it
    if(this.state.redirectLink !== ""){
      return <Redirect to={`/${this.state.redirectLink}`} />
    }

    return(
       <div>
          <form className="form-style" onSubmit={this._handleSubmit}>
            <label id="room-name">Room Name</label>
						<br/>
						<br/>
            <input className="input-home" type="text" onChange={this._handleName} value={this.state.roomName}/>
						<br/>
						<br/>
            <label>Drum Sampler added by Default</label>
            <br />
            <br />
            <label>Choose Starting Sequencer</label>
						
						<br/>
            <SequencerForm sequenceSelect={this._handleSequ} />
						<br/>
						<br/>
            <input className="button" type="submit" />
          </form>
       </div>
    )
  }
}

export default RoomForm;

import React, { Component } from 'react';
import fire from '../../config/Fire'
import SequencerForm from './SequencerForm'

class RoomForm extends Component {
  constructor(){
      super()

      this.state = {
        roomName: "",
        sequName: "",
        selectedRows: false
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

  _handleSequ(rows, name){
    this.setState({
      sequName: name,
      selectedRows: rows
    })
  }

  getPassword(){
    return [...Array(6)].map(i=>(~~(Math.random()*36)).toString(36)).join('').toUpperCase();
  }

  _handleSubmit (e){
    e.preventDefault();

    if( !this.state.selectedRows){
      return;
    }

    const rows = [];
    const userID = localStorage.getItem('user');
    const password = this.getPassword();

    // WHYYYYYYYY?????
    Promise.all(this.state.selectedRows.map( async(instrument) => {

      await fire.firestore().collection('row').add({

        instrument: instrument,
        tone: [false, false, false, false, false, false, false, false, false, false, false,false,  false, false, false, false]

      }).then( (result) => {

        rows.push( result.id )
      })

    })).then( () => {


      fire.firestore().collection('sequencer').add({

          name: this.state.sequName,
          rows: rows

        }).then( (result) => {


          fire.firestore().collection('room').add({
            name: this.state.roomName,
            tempo: 90,
            collaborators: [userID],
            sequencers: [result.id],
            password: password

          })
        })
      })

    this.setState({
      roomName: "",
      sequName: "",
      selectedRows: false
    })

  }

  render(){
    return(
       <div>
          <form onSubmit={this._handleSubmit}>
            <label>Room Name</label>
            <input type="text" onChange={this._handleName} value={this.state.roomName}/>
            <label>Starting Sequencer</label>
            <SequencerForm sequenceSelect={this._handleSequ} />
            <input type="submit" value="Create Room"/>
          </form>
       </div>
    )
  }
}

export default RoomForm;

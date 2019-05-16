import React, { Component } from 'react';
import fire from '../../config/Fire'
import SequencerForm from './SequencerForm'
import { Redirect } from 'react-router-dom'


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

  getPassword(){
    return [...Array(6)].map(i=>(~~(Math.random()*36)).toString(36)).join('').toUpperCase();
  }

  _handleSubmit (e){
    e.preventDefault();

    console.log(this.state)

    if( !this.state.selectedRows){
      return;
    }

    const userID = fire.auth().currentUser.uid;
    const password = this.getPassword();
    const roomName = this.state.roomName;
    console.log(this.state.type);

    if(this.state.type === 'sample'){

      const rows = [];

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
              name: roomName,
              tempo: '90',
              swing: '0',
              collaborators: [userID],
              sequencers: [result.id],
              password: password

            }).then( (result) => {

              const roomID = result.id;
              fire.firestore().collection('user').doc(userID).get().then( (result) => {

                const roomArr = result.data().rooms.slice();
                roomArr.push( roomID );

                fire.firestore().collection('user').doc(userID).update({
                  rooms: roomArr
              }).then( () => {
                this.setState({
                  redirectLink: roomID
                })
              })
            })
          })
        })

      })
    }else if(this.state.type === 'normal'){
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
          type: 'normal'

        }).then( (result) => {


          fire.firestore().collection('room').add({
            name: roomName,
            tempo: '90',
            swing: '0',
            collaborators: [userID],
            sequencers: [result.id],
            password: password

          }).then( (result) => {

            const roomID = result.id;
            fire.firestore().collection('user').doc(userID).get().then( (result) => {

              const roomArr = result.data().rooms.slice();
              roomArr.push( roomID );

              fire.firestore().collection('user').doc(userID).update({
                rooms: roomArr
            }).then( () => {
              this.setState({
                redirectLink: roomID
              })
          })
        })
      })
    })
    }


    this.setState({
      roomName: "",
      sequName: "",
      selectedRows: false,
      type: false
    })

  }

  render(){
    if(this.state.redirectLink !== ""){
      return <Redirect to={`/${this.state.redirectLink}`} />
    }

    return(
       <div>
          <form onSubmit={this._handleSubmit}>
						<br/>
            <label>Room Name</label>
						<br/>
						<br/>
            <input type="text" onChange={this._handleName} value={this.state.roomName}/>
						<br/>
						<br/>
            <label>Starting Sequencer</label>
						<br/>
						<br/>
            <SequencerForm sequenceSelect={this._handleSequ} />
						<br/>
						<br/>
            <input type="submit" />
          </form>
       </div>
    )
  }
}

export default RoomForm;

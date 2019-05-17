import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import fire from '../../config/Fire'
import Tone from 'tone'
import Sequencer from './Sequencer'
import Chat from '../Chat'

class Room extends Component {
  constructor(props){
    super(props);

   Tone.Transport.stop();
   Tone.Transport.cancel();



    this.state = {
      id: this.props.match.params.room,
      name: "",
      sequencers: [],
      transport: false,
      tempo: '',
      exists: true,
      collaborators: [],
      swing: '',
      showMenu: false,
      pincode: ""
    }

    this.createSequences = this.createSequences.bind(this);
    this._playMusic = this._playMusic.bind(this);
    this._changeTempo = this._changeTempo.bind(this);
    this._changeSwing = this._changeSwing.bind(this);
    this.shrinkRoom = this.shrinkRoom.bind(this);
  }

  //this is a lifestyle function called after constructor
  componentDidMount(){
    //gets database and returns as snapshot (only once, no need to update)
    fire.firestore().collection('room').doc(this.state.id).get().then( (snapshot) => {
      if(!snapshot.exists){

        this.setState({
            exists: false
        })

      }else{

        this.setState({
          name: snapshot.data().name,
          pincode: snapshot.data().password,
          tempo: snapshot.data().tempo,
          collaborators: snapshot.data().collaborators,
          swing: snapshot.data().swing

        })

      }
    })
    fire.firestore().collection('room').doc(this.state.id).onSnapshot( (snapshot) => {
      this.setState({
        tempo: snapshot.data().tempo,
        sequencers: snapshot.data().sequencers,
        swing: snapshot.data().swing

      })
    })
  }

  //helper function to create the sequencers based off ID.
  createSequences(){
    const sequencer = [];
    for (let i = 0; i < this.state.sequencers.length; i++ ){
      sequencer.push( <Sequencer key={i} seqID={this.state.sequencers[i]} collaborators={this.state.collaborators}/> ) //add props to sequencer here.
    }
    return sequencer;
  }

  _playMusic(){
    Tone.Transport.toggle();
    let changeTransport = this.state.transport;
    this.setState({
      transport: !changeTransport
    })
  }

  _changeTempo(e){
    let newTempo = e.target.value;

    this.setState({
      tempo: newTempo
    })

    Tone.Transport.bpm.value = this.state.tempo;

    const updateTempo = () => {

      fire.firestore().collection('room').doc(this.state.id).update({
        tempo: this.state.tempo
      })
    }

    clearTimeout(this.time);

    this.time = setTimeout(updateTempo, 1000);
  }

  _changeSwing(e){
    let newSwing = e.target.value;

    this.setState({
      swing: newSwing
    })

    Tone.Transport.swing = this.state.swing / 100;

    const updateSwing = () => {

      fire.firestore().collection('room').doc(this.state.id).update({
        swing: this.state.swing
      })
    }

    clearTimeout(this.time);

    this.time = setTimeout(updateSwing, 500);
  }

  shrinkRoom(b){
    this.setState({
      showMenu: b
    })
  }

  render(){

    const chatVis = this.state.showMenu ? 'shrink-room' : '';

    if(!this.state.exists){
      return <Redirect to='/' />
    }

    return(
      <div>
        <h1 id="room-title">{this.state.name}</h1>

        <div className="room-container">
        <div className={chatVis}>
          <div className="slidecontainer">
            {
              this.state.transport ?
              <button className="transport" onClick={this._playMusic}>◼</button> : <button  className="transport" onClick={this._playMusic}>▶</button>
            }
            <p className="tempo">Tempo: {this.state.tempo} bpm</p>
            <input type="range" min="60" max="180" id='bpm' value={this.state.tempo}  onChange={this._changeTempo} className="slider"/>
            <p className="tempo">Swing Amount: {this.state.swing}</p>
            <input type="range" min="0" max="100" id='bpm' value={this.state.swing}   onChange={this._changeSwing} className="slider"/>
          </div>
          <div className="sequence-wrapper">
            {this.createSequences()}
          </div>
          <h4 id="room-pincode">Room Code: {this.state.pincode}</h4>
        </div>
        </div>
        <Chat roomID={this.state.id} shrinkRoom={this.shrinkRoom} />
      </div>
    )
  }
};

export default Room;

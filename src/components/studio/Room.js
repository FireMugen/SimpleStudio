import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import fire from '../../config/Fire'
import Tone from 'tone'
import Sequencer from './Sequencer'
import Chat from '../Chat'
import { Link } from 'react-router-dom'

class Room extends Component {
  constructor(props){
    super(props);

    //stops the song from a potential previous room from playing and cancel the loop attached
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
        //If the room ID isnt valid, leave
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

    // same as above but this is a listener that will update when the database changes
    fire.firestore().collection('room').doc(this.state.id).onSnapshot( (snapshot) => {
      this.setState({
        tempo: snapshot.data().tempo,
        sequencers: snapshot.data().sequencers,
        swing: snapshot.data().swing

      })
    })
  }

  componentDidUpdate(prevProps, prevState){
    if (prevState !== this.state){
      Tone.Transport.bpm.value = this.state.tempo;
      Tone.Transport.swing = this.state.swing / 100;
    }
  }

  //helper function to create the sequencers based off ID.
  createSequences(){
    const sequencer = [];
    for (let i = 0; i < this.state.sequencers.length; i++ ){
      sequencer.push( <Sequencer key={i} seqID={this.state.sequencers[i]} collaborators={this.state.collaborators}/> ) //add props to sequencer here.
    }
    return sequencer;
  }

//The Play Button
  _playMusic(){
    Tone.Transport.toggle();
    let changeTransport = this.state.transport;
    this.setState({
      transport: !changeTransport
    })
  }

//The BPM and Swing values that talk to the databse
  _changeTempo(e){
    let newTempo = e.target.value;

    this.setState({
      tempo: newTempo
    })

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

    const updateSwing = () => {

      fire.firestore().collection('room').doc(this.state.id).update({
        swing: this.state.swing
      })
    }

    clearTimeout(this.time);

    this.time = setTimeout(updateSwing, 500);
  }

  //When the Chat is opened in its component, add this class which lessens the width the rest of the room
  shrinkRoom(b){
    this.setState({
      showMenu: b
    })
  }

  render(){
    const chatVis = this.state.showMenu ? 'shrink-room' : '';

    //Leave the fake room
    if(!this.state.exists){
      return <Redirect to='/' />
    }

    return(
      <div>
			<Link to='/'><div className="home-link">
				⏮️</div></Link>
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

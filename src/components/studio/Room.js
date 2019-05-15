import React, { Component } from 'react';
import fire from '../../config/Fire'
import Tone from 'tone'
import Sequencer from './Sequencer'
import Chat from '../Chat'
import NavBar from '../NavBar'

class Room extends Component {
  constructor(props){
    super(props);


    this.state = {
      id: this.props.match.params.room,
      name: "",
      sequencers: [],
      transport: false,
      tempo: '',
    }

    console.log(this.state.tempo);
    this.createSequences = this.createSequences.bind(this);
    this._playMusic = this._playMusic.bind(this);
    this._changeTempo = this._changeTempo.bind(this);
    this._updateTempo = this._updateTempo.bind(this);
  }
  //this is a lifestyle function called after constructor
  componentDidMount(){
    //gets database and returns as snapshot (only once, no need to update)
    fire.firestore().collection('room').doc(this.state.id).get().then( (snapshot) => {

      this.setState({
        name: snapshot.data().name,
        sequencers: snapshot.data().sequencers,
        tempo: snapshot.data().tempo
      })
    })
  }

  //helper function to create the sequencers based off ID.
  createSequences(){
    const sequencer = [];
    for (let i = 0; i < this.state.sequencers.length; i++ ){
      sequencer.push( <Sequencer key={i} seqID={this.state.sequencers[i]} /> )
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
    Tone.Transport.bpm.value = e.target.value;

    let newTempo = this.state.tempo;
    newTempo = e.target.value;

    this.setState({
      tempo: newTempo
    })

    console.log(e.target.value);



  }

  _updateTempo() {
    console.log('tempo change');

    // const changeTempo = this.state.tone.slice()

    // changeTempo[e.target.tempo] = !changeTempo[e.target.tempo]
    //
    // //push tempo change to firebase
    // fire.firestore().collection('room').doc(this.state.tempo).update({
    //   tempo: changeTempo
    // })

  }

  render(){
    return(
      <div className="roomBackground">
        <NavBar />
        <h1>{this.state.name}</h1>
        {this.createSequences()}
        <div className="slidecontainer">
          <input type="range" min="60" max="180" id='bpm' value={this.state.tempo} onChange={this._changeTempo} onKeyUp={this._updateTempo} className="slider"/>
        </div>
        <p>Tempo: {this.state.tempo}</p>
        <div>
          {
            this.state.transport ?
            <button className="transport" onClick={this._playMusic}>◼</button> : <button className="transport" onClick={this._playMusic}>▶</button>
          }
        </div>
        <Chat />
      </div>
    )
  }
};

export default Room;

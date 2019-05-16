import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
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
      exists: true,
      collaborators: []
    }

    this.createSequences = this.createSequences.bind(this);
    this._playMusic = this._playMusic.bind(this);
    this._changeTempo = this._changeTempo.bind(this);
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
          sequencers: snapshot.data().sequencers,
          tempo: snapshot.data().tempo,
          collaborators: snapshot.data().collaborators
        })

      }
    })
    fire.firestore().collection('room').doc(this.state.id).onSnapshot( (snapshot) => {
      this.setState({
        tempo: snapshot.data().tempo
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
    Tone.Transport.bpm.value = this.state.tempo;

    let newTempo = e.target.value;

    this.setState({
      tempo: newTempo
    })

    console.log(e.target.value);

    const updateTempo = () => {
      fire.firestore().collection('room').doc(this.state.id).update({
        tempo: this.state.tempo
      });
    }

    clearTimeout(this.time);

    this.time = setTimeout(updateTempo, 1000);
  }

  render(){
    if(!this.state.exists){
      return <Redirect to='/' />
    }

    return(
      <div>
        <NavBar />
        <div className="slidecontainer">
        <h1>{this.state.name}</h1>
          {
            this.state.transport ?
            <button className="transport" onClick={this._playMusic}>◼</button> : <button className="transport" onClick={this._playMusic}>▶</button>
          }
          <p className="tempo">Tempo: {this.state.tempo} bpm</p>
          <input type="range" min="60" max="180" id='bpm' value={this.state.tempo} onChange={this._changeTempo} className="slider"/>
        </div>
        <div>
        </div>
        {this.createSequences()}
        <Chat roomID={this.state.id}/>
      </div>
    )
  }
};

export default Room;

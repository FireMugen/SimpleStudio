import React, { Component } from 'react';
import fire from '../../config/Fire'
import Tone from 'tone'
import Sequencer from './Sequencer'

class Room extends Component {
  constructor(props){
    super(props);

    this.state = {
      id: "uNq7WsGborkMcbU6mxow",
      name: "",
      sequencers: []
    }

    this.createSequences = this.createSequences.bind(this);

  }
//this is a lifestyle function called after constructor
  componentDidMount(){
    //gets database and returns as snapshot (only once, no need to update)
    fire.firestore().collection('room').doc(this.state.id).get().then( (snapshot) => {

      this.setState({
        name: snapshot.data().name,
        sequencers: snapshot.data().sequencers
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
  }

  render(){
    return(
      <div className="roomBackground">
        <h1>{this.state.name}</h1>
        {this.createSequences()}
        <button onClick={this._playMusic}>Play</button>
      </div>
    )
  }
};



export default Room;

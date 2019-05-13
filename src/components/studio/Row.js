import React, { Component } from 'react';
import '../../css/row.css'
import fire from '../../config/Fire'
import Tone from 'tone'

class Row extends Component {
  constructor(props){
    super(props);
    this.state = {
      id: this.props.rowID,
      key: '',
      tone: [] // new Array(16).fill()
    };
    this._updateTile = this._updateTile.bind(this)

  }

  componentDidMount(){
    fire.firestore().collection('row').doc(this.state.id).onSnapshot( (snapshot) => {
      // console.log(snapshot.data().tone)
      this.setState({
        key: snapshot.data().key,
        tone: snapshot.data().tone
      })
    })
  }

  //helper function to build row for tone/instruments
  buildRow() {
    const row = [];
      for (let i = 0; i < 16; i++) {
        row.push(<div onClick={this._updateTile} id={i} key={i} className={this.state.tone[i] ? "selected row-tile" : "row-tile"}> {this.state.tone[i] ? "true" : "false"}</div>)
      }
    return row
  }

  _updateTile(e) {
    const changedTone = this.state.tone.slice()
    changedTone[e.target.id] = !changedTone[e.target.id]

    //this pushes the change to firebase
    fire.firestore().collection('row').doc(this.state.id).update({
      tone: changedTone
    })

  }

  render(){
    return(
      <div className="row-container">
        <div className="row-title"> {this.state.key} </div>
        {this.buildRow()}
        {this.state.tone.length > 0 ? <Music tone={this.state.tone} /> : ''}

      </div>
    )
  }
}


class Music extends Component {
  constructor(props){
    super(props);

    this.state = {
      tonesToPlay: []
    }

  }

  componentDidMount(){
    // console.log(this.props.tone);
    // const synth = new Tone.Synth().toMaster();
    // const drum = new Tone.MembraneSynth().toMaster();

    const tempArr = [];
    for (var i = 0; i < 16; i++) {

      tempArr.push(this.props.tone[i] ? "clap" : null);
    }

    console.log(tempArr)

    this.setState({
      tonesToPlay: tempArr
    })

    // console.log(this.state.tonesToPlay)

    // console.log(tonesToPlay);
    const drum = new Tone.Players({
      "clap" : process.env.PUBLIC_URL + 'assets/CL808.wav',
    }, {
      "volume" : -2,
      "fadeOut" : "64n",
      "autostart": true
    }).toMaster();

    // console.log(this.state.tonesToPlay);

    const loop = new Tone.Sequence(function(time, note){
      // drum.triggerAttackRelease(note, '8n', time);
      drum.get(note).start(time)
    }, this.state.tonesToPlay, '8n')

    loop.start(0);

  }

  componentDidUpdate(prevProps){

  }

  render(){
    return(
      <div />
    )
  }
}

export default Row;

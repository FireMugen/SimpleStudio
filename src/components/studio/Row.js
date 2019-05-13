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
      tone: Array(16)
    };
    this._updateTile = this._updateTile.bind(this)

  }

  componentDidMount(){
    fire.firestore().collection('row').doc(this.state.id).onSnapshot( (snapshot) => {

      this.setState({
        key: snapshot.data().key,
        tone: snapshot.data().tone
      })


    })


    this.setState({
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
        <Music />
      </div>
    )
  }
}

class Music extends Component {
  constructor(){
    super()
    
  }

  componentDidMount(){
    const synth = new Tone.Synth().toMaster();
    const loop = new Tone.Sequence(function(time, note){
      synth.triggerAttackRelease(note, '8n', time);
    }, ['C4', 'C4', 'C4', 'C4', 'C4', 'C4', 'C4', 'C4', 'C4', 'C4', 'C4', 'C4', 'C4', 'C4', 'C4', 'C4'], '8n')

    loop.start(0);

  }

  render(){
    return(
      <div />
    )
  }
}

export default Row;

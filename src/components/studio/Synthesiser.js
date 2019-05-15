import React, { Component } from 'react';
import Row from './Row'
import fire from '../../config/Fire'
import Tone from 'tone'
import { transpose, scale } from "tonal";

class Synthesiser extends Component {
  constructor(props){
    super(props);
    this.state ={
      id: this.props.synthID,
      loop: "",
      tones: this.props.rows,
      noteArray: []
    }

  }

  componentDidMount() {

    fire.firestore().collection('synthesiser').doc(this.state.id).onSnapshot( (snapshot) => {
      this.setState({
        noteArray: scale("major").map(transpose("C2")),
        tones: snapshot.data().tones
      })
    })

    const polySynth = new Tone.PolySynth(6, Tone.Synth, {
      "oscillator" : { "type" : "sine" },
      "volume": -2
    });

    const loop = new Tone.Sequence( (time, col) => {
      for ( let i = 0; i < this.state.tones.length; i++ ){
        if(this.props.rows[i][col]){
          polySynth.triggerAttackRelease(this.state.noteArray[i], '16n')
        }
      }

      Tone.Draw.schedule( () => {
        this.props.activate(col);
      }, time);

    }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], '16n');

    loop.start(0);

    this.setState({
      loop: loop
    })

  }

  createSynth() {
    const row = [];
    for( let j = 0; j < this.state.tones.length; j++ ){
      const column = [];
      for (let i = 0; i < 16; i++) {
        column.push(<div onClick={this._updateTile} id={i} key={i} className={this._getClassNames(i, j)}></div>)
      }
      row.push(column)
    }
    return row
  }

  _getClassNames(i, j){
    let result = "row-tile"

    if (this.state.tones[j][i]){
       result += " selected"
    }

    if (i === this.state.activeCol ){
      result += " active"
    }
    return result
  }

  _updateTile(e) {
    const changedTone = this.state.tone.slice()
    changedTone[e.target.id] = !changedTone[e.target.id]
    //this pushes the change to firebase
    fire.firestore().collection('row').doc(this.state.id).update({
      tone: changedTone
    })

  }

  lightCol(i){
    this.setState({
      activeCol: i
    })
  }

  render(){
    return(
      <div>
        {this.createSynth}
      </div>
    )
  }

}

export default Synthesiser;

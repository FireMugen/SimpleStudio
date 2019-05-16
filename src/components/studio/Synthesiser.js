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
      noteArray: [],
      scale: "",
      octave: "",
      root: ""
    }
    this._updateTile = this._updateTile.bind(this);
    this._onScale = this._onScale.bind(this);
    this._onOctave = this._onOctave.bind(this);
    this._onRoot = this._onRoot.bind(this);
  }

  componentDidMount() {

    fire.firestore().collection('synthesiser').doc(this.state.id).onSnapshot( (snapshot) => {
      const data = snapshot.data();
      const scaleChoice = data.scale;
      const note = data.root + data.octave;
      console.log(note);
      this.setState({
        noteArray: scale(scaleChoice).map(transpose(note)).reverse(),
        tones: [
          data.row0,
          data.row1,
          data.row2,
          data.row3,
          data.row4,
          data.row5,
          data.row6
        ],
        scale: data.scale,
        octave: data.octave,
        root: data.root
      })
      console.log(this.state.noteArray);
    })


    const polySynth = new Tone.PolySynth(7, Tone.Synth, {
      "oscillator" : { "type" : "sine" },
      "volume": -5
    }).toMaster();

    // var bitcrusher = new Tone.BitCrusher({
    //   "bits": 8,
    //   "wet": 0
    // }).toMaster();
    //
    // var freeverb = new Tone.Freeverb({
    //   "roomSize": 0.75,
    //   "dampening": 2000,
    //   "wet": 0
    // }).toMaster();
    //
    // var chorus = new Tone.Chorus({
    //   "frequency": 2.5,
    //   "delayTime": 0.5,
    //   "depth": 1,
    //   "feedback": 0.3,
    //   "wet": 0
    // }).toMaster();
    //
    // polySynth.chain(bitcrusher, chorus, freeverb, Tone.Master);

    const loop = new Tone.Sequence( (time, col) => {
      for ( let i = 0; i < this.state.tones.length; i++ ){
        if(this.state.tones[i][col]){
          polySynth.triggerAttackRelease(this.state.noteArray[i], '16n')
        }
      }

      Tone.Draw.schedule( () => {
        this.lightCol(col);
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
      let column = [];

      column.push(<div className="row-title"> {this.state.noteArray[j]} </div>)

      for (let i = 0; i < 16; i++) {
        column.push(<div onClick={this._updateTile} id={`${j}rowcol${i}`} key={i} className={this._getClassNames(i, j)}></div>)
      }
      row.push(<div className="row-container">{column}</div>);
    }
    return row
  }

  _getClassNames(i, j){
    let result = "row-tile"

    if (this.state.tones[j][i]){
       result += " selected"
    }

    if (i === this.state.activeCol ){
      result += " active-tile"
    }
    return result
  }

  _updateTile(e) {
    const rownum = e.target.id[0];
    const colnum = e.target.id.slice(e.target.id.indexOf('l') + 1)
    const changedNote = this.state.tones.slice()
    changedNote[rownum][colnum] = !changedNote[rownum][colnum];
    //this pushes the change to firebase
    fire.firestore().collection('synthesiser').doc(this.state.id).update({

      row0: changedNote[0],
      row1: changedNote[1],
      row2: changedNote[2],
      row3: changedNote[3],
      row4: changedNote[4],
      row5: changedNote[5],
      row6: changedNote[6]

    })

  }

  lightCol(i){
    this.setState({
      activeCol: i
    })
  }

  _onScale(e){
    fire.firestore().collection('synthesiser').doc(this.state.id).update({
        scale: e.target.value
    })
  }

  _onOctave(e){
    fire.firestore().collection('synthesiser').doc(this.state.id).update({
        octave: e.target.value
    })
  }

  _onRoot(e){
    fire.firestore().collection('synthesiser').doc(this.state.id).update({
        root: e.target.value
    })
  }

  render(){
    return(
      <>
      <div className="scale-controls-container">
        <div className="scale-controls">
          <label>Choose Scale</label>
          <select onChange={this._onScale} value={this.state.scale}>
            <option value="major">Major</option>
            <option value="minor">Minor</option>
            <option value="pentatonic">Pentatonic</option>
          </select>
        </div>
        <div className="scale-controls">
          <label>Choose Octave</label>
          <select onChange={this._onOctave} value={this.state.octave}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </div>
        <div className="scale-controls">
          <label>Choose Root Note</label>
          <select onChange={this._onRoot} value={this.state.root}>
            <option value="A">A</option>
            <option value="Bb">Bb</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="Db">Db</option>
            <option value="D">D</option>
            <option value="Eb">Eb</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="Gb">Gb</option>
            <option value="G">G</option>
          </select>
        </div>
      </div>
      <div>
      {this.createSynth()}
      </div>
      </>
    )
  }

}

export default Synthesiser;

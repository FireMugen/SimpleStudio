import React, { Component } from 'react';
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
      root: "",
      chorus: "",
      chorusAmount: 0,
      reverb: "",
      reverbAmount: 0,
      delay: "",
      delayAmount: 0,
      vol: "",
      volAmount: -12
    }
    this._updateTile = this._updateTile.bind(this);
    this._onScale = this._onScale.bind(this);
    this._onOctave = this._onOctave.bind(this);
    this._onRoot = this._onRoot.bind(this);
    this._handleChorus = this._handleChorus.bind(this)
    this._handleReverb = this._handleReverb.bind(this)
    this._handleDelay = this._handleDelay.bind(this)
    this._handleVol = this._handleVol.bind(this)
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
        root: data.root,
        chorusAmount: data.chorus,
        delayAmount: data.delay,
        reverbAmount: data.reverb,
        volAmount: data.volume

      })

    })

    const polySynth = new Tone.PolySynth(7, Tone.Synth, {
      "oscillator" : { "type" : "sine" },
      "volume": -6
    })

    var pingPong = new Tone.PingPongDelay({
      "delayTime": "4n",
      "feedback": 0.2,
      "wet": 0
    }).toMaster();

    var chorus = new Tone.Chorus({
      "frequency": 2.5,
      "delayTime": 0.5,
      "depth": 1,
      "feedback": 0.3,
      "wet": 0
    }).toMaster();

    var reverb = new Tone.Freeverb({
      "roomSize": 0.8,
      "dampening": 12000,
      "wet": 0
    }).toMaster();

    var vol = new Tone.Volume({
      "volume": -12,
    });

    polySynth.chain(vol, chorus, pingPong, reverb, Tone.Master)

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
      loop: loop,
      chorus: chorus,
      reverb: reverb,
      delay: pingPong,
      vol: vol
    })

  }

  _handleChorus(e) {
    this.setState({
      chorusAmount: e.target.value
    })

    this.state.chorus.wet.value = (this.state.chorusAmount / 100);

    const updateChorus = () => {

      fire.firestore().collection('synthesiser').doc(this.state.id).update({
        chorus: this.state.chorusAmount
      })
    }

    clearTimeout(this.time);

    this.time = setTimeout(updateChorus, 500);
  }

  _handleReverb(e) {
    this.setState({
      reverbAmount: e.target.value
    })

    this.state.reverb.wet.value = (this.state.reverbAmount / 100);

    const updateReverb = () => {

      fire.firestore().collection('synthesiser').doc(this.state.id).update({
        reverb: this.state.reverbAmount
      })
    }

    clearTimeout(this.time);

    this.time = setTimeout(updateReverb, 500);
  }

  _handleDelay(e) {
    this.setState({
      delayAmount: e.target.value
    })

    this.state.delay.wet.value = (this.state.delayAmount / 100);

    const updateDelay = () => {

      fire.firestore().collection('synthesiser').doc(this.state.id).update({
        delay: this.state.delayAmount
      })
    }

    clearTimeout(this.time);

    this.time = setTimeout(updateDelay, 500);
  }

  _handleVol(e) {
    this.setState({
      volAmount: e.target.value
    })

    this.state.vol.volume.value = this.state.volAmount;

    const updateVolume = () => {

      fire.firestore().collection('synthesiser').doc(this.state.id).update({
        volume: this.state.volAmount
      })
    }

    clearTimeout(this.time);

    this.time = setTimeout(updateVolume, 500);
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
        </div>
        <div className="effects-slider-container">
          <label>Chorus Amount:</label>
          <input type="range" min="0" max="100" value={this.state.chorusAmount} onChange={this._handleChorus} className="slider"/>
          <label>Delay Amount:</label>
          <input type="range" min="0" max="100" value={this.state.delayAmount} onChange={this._handleDelay} className="slider"/>
        </div>
        <div className="effects-slider-container">
          <label>Reverb Amount:</label>
          <input type="range" min="0" max="50" value={this.state.reverbAmount} onChange={this._handleReverb} className="slider"/>

          <label>Volume Amount:</label>
          <input type="range" min="-64" max="-6" value={this.state.volAmount} onChange={this._handleVol} className="slider"/>
        </div>
        <div>
        {this.createSynth()}
        </div>
      </>
    )
  }
}

export default Synthesiser;

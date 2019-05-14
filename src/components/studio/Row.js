import React, { Component } from 'react';
import '../../css/row.css'
import fire from '../../config/Fire'
import Tone from 'tone'

class Row extends Component {
  constructor(props){
    super(props);
    this.state = {
      id: this.props.rowID,
      instrument: '',
      tone: [] // new Array(16).fill()
    };
    this._updateTile = this._updateTile.bind(this)

  }

  componentDidMount(){
    fire.firestore().collection('row').doc(this.state.id).onSnapshot( (snapshot) => {
      this.setState({
        instrument: snapshot.data().instrument,
        tone: snapshot.data().tone
      })
    })
  }

  //helper function to build row for tone/instruments
  buildRow() {
    const row = [];
      for (let i = 0; i < 16; i++) {
        row.push(<div onClick={this._updateTile} id={i} key={i} className={this.state.tone[i] ? "selected row-tile" : "row-tile"}></div>)
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
        <div className="row-title"> {this.state.instrument} </div>
        {this.buildRow()}
        <Music tone={this.state.tone} instrument={this.state.instrument}/>

      </div>
    )
  }
}

class Music extends Component {
  constructor(props){
    super(props);

    this.state ={
      loop: ""
    }
  }


  componentDidMount(){
    const instrument = this.props.instrument;
    const instrumentLink = process.env.PUBLIC_URL + 'assets/' + this.props.instrument + '.mp3' ;

    const drum = new Tone.Players({
      // "clap" : process.env.PUBLIC_URL + 'assets/BD.mp3'
      // this.props.instrument : process.env.PUBLIC_URL + this.props.instrument + '.mp3
      instrument : instrumentLink
    }).toMaster()


    const loop = new Tone.Sequence(function(time, note){
      drum.get(note).start(time)
    }, new Array(16), '16n')

    loop.start(0);

    this.setState({
      loop: loop
    })

  }

  componentDidUpdate(prevProps){
    if( prevProps.tone !== this.props.tone ) {
      console.log("yeah")
      for (var i = 0; i < 16; i++) {
        if (this.props.tone[i]){
          this.state.loop.at(i, "clap");

        }else{
          this.state.loop.remove(i);
        }
      }
    }
  }

  render(){
    return(
      <div />
    )
  }
}

export default Row;

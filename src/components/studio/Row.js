import React, { Component } from 'react';
import '../../css/row.scss'
import fire from '../../config/Fire'
import Tone from 'tone'

class Row extends Component {
  constructor(props){
    super(props);
    const user=fire.auth().currentUser;

    this.state = {
      id: this.props.rowID,
      instrument: '',
      tone: [],
      activeCol: -1,
      collaborators: this.props.collaborators,
      userID: user.uid
    };
    this._updateTile = this._updateTile.bind(this)
    this._getClassNames = this._getClassNames.bind(this)
    this.lightCol = this.lightCol.bind(this)
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

        //add ternery here for the onclick, if true user auth on this room, calls this._updateTile otherwise do nothing.

        // this.state.collaborators.includes(this.state.userID) ? true : false
        //if room colaborators is equal to current user
        row.push(<div onClick={this.state.collaborators.includes(this.state.userID) ? this._updateTile : "" } id={i} key={i} className={this._getClassNames(i)}></div>)
      }
    return row
  }

  _getClassNames(i){
    let result = "row-tile"
    if (this.state.tone[i]){
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
      <div className="row-container">
        <div className="row-title"> {this.state.instrument} </div>
        {this.buildRow()}
        {
          this.state.instrument ? <Music tone={this.state.tone} instrument={this.state.instrument} activate={this.lightCol}/> : ""
        }
      </div>
    )
  }
}

class Music extends Component {
  constructor(props){
    super(props);

    this.state ={
      loop: "",
      play: []
    }
  }


  componentDidMount(){

    const link = process.env.PUBLIC_URL + 'assets/' + this.props.instrument + '.mp3';

    console.log(link);

    const drum = new Tone.Players({
      [this.props.instrument] : link
    }, {
      'volume': -2,
    }).toMaster()

    const loop = new Tone.Sequence( (time, col) => {
      if(this.props.tone[col]){

        drum.get(this.props.instrument).start(time)

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

  componentDidUpdate(prevProps){
    if( prevProps.tone !== this.props.tone ) {
      this.setState({

      })
    }
  }

  render(){
    return(
      <div />
    )
  }
}

export default Row;

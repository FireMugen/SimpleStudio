import React, { Component } from 'react';
import '../../css/row.css'

class Row extends Component {
  constructor(props){
    super(props);
    this.state = {
      id: '',
      key: '',
      tone: Array(16)
    };
    this._updateTile = this._updateTile.bind(this)

  }

  componentDidMount(){
    this.setState({
      id: 'SAZSDASDAWE',
      key: 'snare',
      tone: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false]
    })
  }


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
    this.setState({
      tone: changedTone
    })
    console.log(e.target)
  }



  render(){
    return(
      <div className="row-container">
        <div className="row-title"> {this.state.key} </div>
        {this.buildRow()}
      </div>
    )
  }
}

export default Row;

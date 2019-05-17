import React, { Component } from 'react';

class SequencerForm extends Component {
  constructor(props){
    super(props)

    this.state = {
      value: ""
    }

    this._handleChange = this._handleChange.bind(this);
  }

  _handleChange(e){

    this.setState({
      value: e.target.value
    })

    if (e.target.value === 'normal'){
      this.props.sequenceSelect(
        [],
        "Sine Synth Sequencer",
        'normal'
      );
    }else if ( e.target.value === 'empty' ){
      this.props.sequenceSelect(
        false,
        "",
        ""
      )
    }
  }
//Uses a drop down menu to select which step sequencer object to use. If we add more this is where the options would go. Passes the results to the RoomForm Component
  render(){
    return(
      <select className="select-menu" onChange={this._handleChange} value={this.state.value}>
        <option value="empty">Select A Sequencer</option>
        <option value="normal">Sine Synth Sequencer</option>
      </select>
    )
  }
}

export default SequencerForm;

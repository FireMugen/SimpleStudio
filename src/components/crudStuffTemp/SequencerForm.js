import React, { Component } from 'react';
import fire from '../../config/Fire'


class SequencerForm extends Component {
  constructor(props){
    super(props)

    this.state = {
      value: ""
    }

    this._handleChange = this._handleChange.bind(this);
  }

  optionsSequence(){
    const options = [];
    return([
      <option value="empty">Select A Sequencer</option>,
      <option value="drum">Drum Sequencer</option>
    ])
  }

  _handleChange(e){

    this.setState({
      value: e.target.value
    })

    if( e.target.value === 'drum' ){
      this.props.sequenceSelect(
        [
          "CLAP",
          "CLOSEDHAT",
          "SNARE",
          "COWBELL",
          "CYMBAL",
          "KICK",
          "OPENHIHAT",
          "RIMSHOT"
        ],
        "Drum Sequencer"
      );
    }else if ( e.target.value === 'empty' ){
      this.props.sequenceSelect(
        false,
        ""
      )
    }
  }

  render(){
    return(
      <select onChange={this._handleChange} value={this.state.value}>
        {this.optionsSequence()}
      </select>
    )
  }
}

export default SequencerForm;

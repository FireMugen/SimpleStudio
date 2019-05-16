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

  render(){
    return(
      <select onChange={this._handleChange} value={this.state.value}>
        <option value="empty">Select A Sequencer</option>,
        <option value="normal">Sine Synth Sequencer</option>
      </select>
    )
  }
}

export default SequencerForm;

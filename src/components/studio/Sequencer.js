import React, { Component } from 'react';
import Row from './Row'


function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Sequencer extends Component {
  render(){
    return(
      <div>
        <Row />
        <Row />
      </div>
    )
  }
};



export default Sequencer;

import React, { Component } from 'react';
import Row from './Row'
import fire from '../../config/Fire'
// import Tone from 'tone'

class Sequencer extends Component {
  constructor(props){
    super(props);

    this.state = {
      id: this.props.seqID,
      name: "",
      rows: []
    }

    this.createRows = this.createRows.bind(this);

  }
  //this is a lifestyle function called after constructor
  componentDidMount(){
    //gets database and returns as snapshot (only once, no need to update)
    fire.firestore().collection('sequencer').doc(this.state.id).get().then( (snapshot) => {

      this.setState({
        name: snapshot.data().name,
        rows: snapshot.data().rows
      })
    })
  }

  //helper function to create the sequencer rows based off ID.
  createRows(){
    const rows = [];
    for (let i = 0; i < this.state.rows.length; i++ ){
      rows.push( <Row key={i} rowID={this.state.rows[i]} /> )
    }
    return rows;
  }

  render(){
    return(
      <div>
        <h3>{this.state.name}</h3>
        {this.createRows()}
      </div>
    )
  }
};

export default Sequencer;

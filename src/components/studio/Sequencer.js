import React, { Component } from 'react';
import Row from './Row'
import fire from '../../config/Fire'
import Synthesiser from './Synthesiser'

class Sequencer extends Component {
  constructor(props){
    super(props);

    this.state = {
      id: this.props.seqID,
      name: "",
      rows: [],
      isSynth: false
    }

    this.createRows = this.createRows.bind(this);

  }

  //this is a lifestyle function called after constructor
  componentDidMount(){
    //If the id is a sequencer ID then set the State to create one, otherwise check if it a synthesiser id and set the state for that
    fire.firestore().collection('sequencer').doc(this.state.id).get().then( (snapshot) => {
      if( snapshot.exists ){
        this.setState({
          name: snapshot.data().name,
          rows: snapshot.data().rows,
          isSynth: false
        })
      }else{
        fire.firestore().collection('synthesiser').doc(this.state.id).get().then( (snapshot) => {
          const data = snapshot.data();
          this.setState({
            name: data.name,
            rows: [
              data.row0,
              data.row1,
              data.row2,
              data.row3,
              data.row4,
              data.row5,
              data.row6
            ],
            isSynth: true
          })
        })
      }
    })
  }

  //helper function to create the sequencer rows based off ID. It checks if it is a Synth or not and creates accordingly, passing in the appropriate values
  createRows(){
    if(this.state.isSynth){
      return <Synthesiser synthID={this.state.id} rows={this.state.rows}/>
    }else{
      const rows = [];
      for (let i = 0; i < this.state.rows.length; i++ ){
        rows.push( <Row key={i} rowID={this.state.rows[i]} collaborators={this.props.collaborators}/> )
      }
      return rows;
    }
  }

  render(){
    return(
      <div>

        {this.createRows()}
      </div>
    )
  }
};

export default Sequencer;

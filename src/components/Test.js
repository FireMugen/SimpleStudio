import React, { Component } from 'react';
import fire from '../config/Fire.js'
import roomLoad from '../config/fireutils.js'

class Test extends Component{
  constructor(){
    super();

    this.state = {
      id: "",
      sequence: "",
      other: 0
    }


    this._changeText = this._changeText.bind(this)
    this._changeNum = this._changeNum.bind(this)

    // fire.firestore().collection('room').get().then((snapshot) => {
    //   this.setState({
    //     id: snapshot.docs[0].id,
  //     sequence: snapshot.docs[0].data().sequence,
    //     other: snapshot.docs[0].data().other
    //   })
    //
    // })
  }

  componentDidMount(){

    fire.firestore().collection('room').onSnapshot( (snapshot) => {
      let changes = snapshot.docChanges();

      changes.forEach( (change) => {
        if(change.type == 'added' || change.type == 'modified'){

          this.setState({
            id: change.doc.id,
            sequence: change.doc.data().sequence,
            other: change.doc.data().other
          })

        }
      })
    })

  }

  _changeText(e){
    fire.firestore().collection('room').doc(this.state.id).update({
      sequence: e.target.value
    })
  }

  _changeNum(e){
    fire.firestore().collection('room').doc(this.state.id).update({
      other: e.target.value
    })
  }

  render(){
    return(
      <div>
        <form>
          <input onChange={this._changeText} type="text" value={this.state.sequence} />
          <input onChange={this._changeNum} type="number" value={this.state.other} />
        </form>
      </div>
    )
  }
}

export default Test

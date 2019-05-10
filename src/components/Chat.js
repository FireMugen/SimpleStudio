import React, { Component } from 'react';

class ChatRoom extends Component {
    constructor(props, context){
      super(props, context);
      this.updateMessage = this.updateMessage.bind(this)
      this.submitMessage = this.submitMessage.bind(this)
      this.state = {
        message: '',
        messages: [

        ]
      }
    }
    updateMessage(e){
      this.setState({
        message: e.target.value
      })
    }
    submitMessage(e){
      console.log('submit '+ this.state.message);
      const nextMessage = {
        id: this.state.messages.length,
        text: this.state.message
      }
      var list = Object.assign([], this.state.messages)

      list.push(nextMessage)
      this.setState({
        messages: list
      })
    }

    render(){
      const currentMessage = this.state.messages.map((message, i) => {
        return (
          <li key={message.id}>{message.text}</li>
        )
      })

    return(
      <div>
        <ol>
          {currentMessage}
        </ol>
        <input onChange={this.updateMessage} type="text" placeholder="Message" />
        <br />
        <button onClick={this.submitMessage}> Submit Message </button>
      </div>
    )
  }
}

export default ChatRoom

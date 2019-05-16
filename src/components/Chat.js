import React, { Component } from 'react';
import fire from '../config/Fire';
import chatbar from '../css/chatbar.scss'
import ScrollableFeed from 'react-scrollable-feed'


class ChatRoom extends Component {
    constructor(props, context){
      super(props, context);
      this.updateMessage = this.updateMessage.bind(this)
      this.submitMessage = this.submitMessage.bind(this)
      const user = fire.auth().currentUser;
      this.state = {
        message: '',
        messages: [],
        showMenu: false,
        userName: user.displayName,
        //a room state needs to be added.
        roomID: this.props.roomID

      }
    }

    componentDidMount(){
      //messages needs to be turned into a variable based off room name.
      fire.database().ref(`${this.state.roomID}/`).on('value', (snapshot) =>{

        const currentMessages = snapshot.val()

        if (currentMessages != null){
          this.setState({
            messages: currentMessages
          })

        }
      })
    }

    updateMessage(e){
      this.setState({
        message: e.target.value
      })
    }
    submitMessage(e){
      e.preventDefault()

      const nextMessage = {
        id: this.state.messages.length,
        text: this.state.message,
        user: this.state.userName
      }

      //messages needs to be updated to include room id ie room state
      fire.database().ref(`${this.state.roomID}/`+nextMessage.id).set(nextMessage)

      this.setState({message: ''})
    }

    chatToggle = () => {
      this.props.shrinkRoom(!this.state.showMenu);
      
      this.setState({
        showMenu: !this.state.showMenu
      })
    }

    render(){
      const currentMessage = this.state.messages.map((message, i, user) => {
        return (
          <li key={message.id}>{message.user}: {message.text}</li>
        )
      })

      const chatVis = this.state.showMenu ? 'active' : '';


    return(
      <div className="chat-bar">
        <span class="chatbar-toggle" onClick={this.chatToggle}>
          <div className="chat-bar-logo">💬</div>
        </span>
        <form className={`main-chat ${chatVis}`} onSubmit={this.submitMessage}>
          <ol>
            <ScrollableFeed forceScroll='true'>
              {currentMessage}
            </ScrollableFeed>
          </ol>
          <input value={this.state.message} onChange={this.updateMessage} type="text" placeholder="Send Message to Room" className="chat-input"/>
          <br />
        </form>
      </div>
    )
  }
}

export default ChatRoom

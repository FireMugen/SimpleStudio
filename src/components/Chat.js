import React, { Component } from 'react';
import fire from '../config/Fire';
import chatbar from '../css/chatbar.scss'


class ChatRoom extends Component {
    constructor(props, context){
      super(props, context);
      this.updateMessage = this.updateMessage.bind(this)
      this.submitMessage = this.submitMessage.bind(this)
      this.state = {
        message: '',
        messages: [],
        showMenu: false
      }
    }

    componentDidMount(){
      console.log('chat mounted');

      fire.database().ref('messages/').on('value', (snapshot) =>{

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
      console.log('submit '+ this.state.message);
      e.preventDefault()


      const nextMessage = {
        id: this.state.messages.length,
        text: this.state.message
      }

      fire.database().ref('messages/'+nextMessage.id).set(nextMessage)

      this.setState({message: ''})
    }

    // mainNav = document.getElementById('js-menu');
    // navBarToggle = document.getElementById('js-navbar-toggle');
    // navBarToggle.addEventListener('click', function () {
    //
    //   mainNav.classList.toggle('active');
    // });

    chatToggle = () => {
      this.setState({
        showMenu: !this.state.showMenu
      })
    }

    handleOnKeyDown = (e) => {
      if (e.key === 'Escape') {
          console.log('hi');
          e.preventDefault();
      }
    }

    render(){
      const currentMessage = this.state.messages.map((message, i) => {
        return (
          <li key={message.id}>{message.text}</li>
        )
      })
      const menuVis = this.state.showMenu ? 'active' : '';

    return(
      <div className="chat-bar">
        <span class="chatbar-toggle" onClick={this.chatToggle}>
          <div className="chat-bar-logo">##</div>
        </span>
        <form className={`main-chat ${menuVis}`} onSubmit={this.submitMessage}>
          <ol>
            <div className="chat-messages">{currentMessage}</div>
          </ol>
          <input value={this.state.message} onChange={this.updateMessage} type="text" placeholder="Message" class="chat-input"/>
          <br />
        </form>
      </div>
    )
  }
}

export default ChatRoom

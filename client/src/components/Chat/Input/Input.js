import React from 'react';
import { PrimaryButton, DefaultButton }  from '@fluentui/react/lib/Button';

// import onlineIcon from '../../icons/onlineIcon.png';
// import closeIcon from '../../icons/closeIcon.png';

import './Input.css';


const Input = ({ message, setMessage, sendMessage }) => (
  <form className="form">
    <input
      className="input"
      type="text"
      placeholder="Type a message..."
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
    />
    <PrimaryButton className="sendButton" 
    text="Send"
    onClick={(event) => sendMessage(event)} ></PrimaryButton>
  </form>  
)
export default Input;
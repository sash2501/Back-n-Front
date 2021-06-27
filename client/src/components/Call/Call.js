import React, { useState, useEffect } from "react";
//import Peer from 'peer';
import Peer from "simple-peer";
import queryString from 'query-string';
import styled from "styled-components";


import InfoBar from '../MessageBar/MessageBar';
import MessageDisplayer from '../MessageDisplayer/MessageDisplayer';
import IconList from '../IconList/IconList';
import Input from '../Input/Input';
//import OnlinePeople from '../OnlinePeople/OnlinePeople';

import './Call.css';
// client-side
const io = require("socket.io-client");
const ENDPOINT = 'http://localhost:5000'

let socket;

const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;

const StyledVideo = styled.video`
    height: 40%;
    width: 50%;
`;

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}


const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};
  
const Call = ( {location}) => {

  const [username, setUserName] = useState('');
  const [roomname, setRoomName] = useState(''); //initialize as empty string
  const [message, setMessage] = useState(''); //store message
  const [messageList, setMessageList] = useState([]); //store all messages
  const [mystream, setMyStream] = useState(null)  
  //----------------------------------------------------
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  
  useEffect( () => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setUserName(name);
    setRoomName(room);
   
      
    socket.emit('join', { name, room }, () => { 
      return () => {
        //disconnect useEffect hook -  unmounting of component
        socket.emit('disconnect');

        socket.off() //remove the one client instance
      }
    });
  }, [ENDPOINT, location.search]);
  
  ///handling messages recieved - store the messages
  useEffect(() => {
    socket.on('message', (message)=>{
      setMessageList([...messageList, message]);
    });

  },[]);

  //senidng messages
  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  console.log(message, messageList);

  return (
    <div className="messageContainer">
    <IconList room={roomname} /> 
    <div class="videos__group">
      <div id="video-grid">

      </div>
    </div><Video />
      <div className="container">
      <InfoBar />   
      <MessageDisplayer messages={messageList} name={username} />   
      
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
      </div>
    </div>
  )
}

export default Call;
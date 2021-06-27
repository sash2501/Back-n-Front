import React, { useState, useEffect } from "react";
import Peer from 'peer';
import queryString from 'query-string';


import InfoBar from '../MessageBar/MessageBar';
import MessageDisplayer from '../MessageDisplayer/MessageDisplayer';
import IconList from '../IconList/IconList';
import Input from '../Input/Input';
import Video from "../Video/Video";
//import OnlinePeople from '../OnlinePeople/OnlinePeople';

import './Call.css';
// client-side
const io = require("socket.io-client");
const ENDPOINT = 'http://localhost:5000'

let socket;
const peer = new Peer(undefined, {
  host: '/',
  port: '443'
})
  
const Call = ( {location}) => {

  const [username, setUserName] = useState('');
  const [roomname, setRoomName] = useState(''); //initialize as empty string
  const [message, setMessage] = useState(''); //store message
  const [messageList, setMessageList] = useState([]); //store all messages
  //const [userList, setUserList] = useState('');
  //const [displayStream, setDisplayStream] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [mystream, setMyStream] = useState(null)
  
  const videoGrid = document.getElementById("video-grid");
  const myVideo = document.createElement("video");  

  useEffect( () => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setUserName(name);
    setRoomName(room);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setMyStream(currentStream);

        addVideoStream(myVideo, currentStream);

        peer.on("call", (call) => {
              call.answer(currentStream);
              const video = document.createElement("video");
              call.on("stream", (userVideoStream) => {
                addVideoStream(video, userVideoStream);
              });
            });

        socket.on("user-connected", (name) => {
              connectToNewUser(name, currentStream);
            });
    
      });
      
    peer.on("open", () => {
      //start connection
    socket.emit('join', { name, room }, () => { //ES6 syntax
      // if(error) {
      //   alert(error);
      // }

      return () => {
        //disconnect useEffect hook -  unmounting of component
        socket.emit('disconnect');

        socket.off() //remove the one client instance
      }
    });    
    })

    
  }, [ENDPOINT, location.search]);

  // useEffect(() => {
  //   navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  //     .then((currentStream) => {
  //       setMyStream(currentStream);

  //       addVideoStream(video, currentStream);
  //     });
  //     peer.on("call", (call) => {
  //             call.answer(stream);
  //             const video = document.createElement("video");
  //             call.on("stream", (userVideoStream) => {
  //               addVideoStream(video, userVideoStream);
  //             });
  //           });

  //   socket.on("user-connected", (name) => {
  //             connectToNewUser(name, stream);
  //           });

    
  // }, []);



  ///handling messages recieved - store the messages
  useEffect(() => {
    socket.on('message', (message)=>{
      setMessageList([...messageList, message]);
    });

    // socket.on('roomData', (users)=>{
    //   setUserList(users);
    // });
    

  },[]);

  //senidng messages
  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  const connectToNewUser = (name, stream) => {
    const call = peer.call(name, stream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
  };

  const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(video);
    });
  };



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
      {/* <OnlinePeople users = {userList}/> */}
    </div>
  )
}

export default Call;
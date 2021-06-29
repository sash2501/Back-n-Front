import React, { useState, useEffect, useRef } from "react";
//import Peer from 'peer';
import Peer from "simple-peer";
import queryString from 'query-string';
import styled from "styled-components";
import { Stack, IStackTokens} from '@fluentui/react/lib/Stack';
import { DefaultButton } from '@fluentui/react/lib/Button';


import InfoBar from '../Chat/MessageBar/MessageBar';
import MessageDisplayer from '../Chat/MessageDisplayer/MessageDisplayer';
import IconList from '../IconList/IconList';
import Input from '../Chat/Input/Input';
import Video from '../Video/Video'

//import OnlinePeople from '../OnlinePeople/OnlinePeople';

import './Call.css';
// client-side
const io = require("socket.io-client");
const ENDPOINT = 'http://localhost:5001'
const stackTokens: IStackTokens = { childrenGap: 20 };

let socket;

const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
    justifyContent: center
`;

const StyledVideo = styled.video`
    height: 40%;
    width: 50%;
`;
// const videoConstraints = {
//     height: window.innerHeight / 2,
//     width: window.innerWidth / 2
// };
  
const Call = ( {location}) => {

  const [username, setUserName] = useState('');
  const [roomname, setRoomName] = useState(''); //initialize as empty string
  const [message, setMessage] = useState(''); //store message
  const [messageList, setMessageList] = useState([]); //store all messages
  const [mystream, setMyStream] = useState(null)  
  //----------------------------------------------------
  const [peersList, setPeersList] = useState([]); //ui reflection of state
  const userVideo = useRef();
  const mediaRef = useRef();
  const peersRef = useRef([]); //related to ui and visuals
  const [callEnded, setCallEnded] = useState(false);
  let creatingID;
  
  useEffect( () => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setUserName(name);
    setRoomName(room);


    //socket = io.connect("/");
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        userVideo.current.srcObject = stream;
        setMyStream(stream);
        mediaRef.current = stream;
        socket.emit("join room", {name, room}, error => {if(error) alert(error)});

        
        socket.on("all users", users => {
            const peers = [];
            users.forEach(user => {
                console.log(user.id);
                const peer = createPeer(user.id, socket.id, stream);
                peersRef.current.push({
                    peerID: user.id,
                    peer,
                })
                peers.push({
                  peerID: user.id,
                  peer,
                  });
            })
            console.log("peerlisist after create peer", peers);
            setPeersList(peers);
        })

        socket.on("user joined", payload => {
            console.log("user joined");
            const peer = addPeer(payload.signal, payload.callerID, stream);
            peersRef.current.push({
                peerID: payload.callerID,
                peer,
            })

            const peerObj = {              
              peerID: payload.callerID,
              peer
            }
            
            console.log("user joined obj", peerObj);
            
            setPeersList(users => [...users, peerObj]);
            console.log("[eerslist after add peer", peersList);
        });

        socket.on("receiving returned signal", payload => {
            const item = peersRef.current.find(p => p.peerID === payload.id);
            item.peer.signal(payload.signal);
        });

        socket.on('user left', id => {

          const peerObj = peersRef.current.find(p => p.peerID === id);
          if(peerObj) {
            peerObj.peer.destroy();
          }
          const peers = peersRef.current.filter(p => p.peerID !== id);
          peersRef.current = peers;
          setPeersList(peers);
          //peersList[callerID].destroy();
          setCallEnded(true);
          console.log(id," left");
        })
    })

    

    // return () => {
    //     //disconnect useEffect hook -  unmounting of component
    //     socket.emit('disconnect');

    //     socket.off() //remove the one client instance
    //   }
   
  }, [ENDPOINT, location.search]);
  
  ///handling messages recieved - store the messages
  useEffect(() => {
    socket.on('message', (message)=>{
      setMessageList(messageList => [...messageList, message]);
    });

  },[]);

  function createPeer(userToSignal, callerID, stream) {
        creatingID = userToSignal;
        console.log("in create peer", userToSignal);
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socket.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

  function addPeer(incomingSignal, callerID, stream) {
      console.log("in addPeer", incomingSignal);
      const peer = new Peer({
          initiator: false,
          trickle: false,
          stream,
      })

      peer.on("signal", signal => {
          socket.emit("returning signal", { signal, callerID })
      })

      peer.signal(incomingSignal);
      peer.on('close', () => {
          console.log("closing peer");
      })
      return peer;
    }

  //sending messages
  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  console.log(message, messageList);
  const peerList_duplicateLess = peersList.filter((v,i) => {
    return peersList.map((peer)=> peer.peerID).indexOf(v.peerID) == i
  })

  console.log("peerslist final",peersList);  
  console.log("result wout duplicate", peerList_duplicateLess);

  return (
    <div>
      <Stack horizontal>
      <Stack vertical>
        <IconList room={roomname} media={mystream} /> 
        <Container>
            <StyledVideo id="myVideo" muted ref={userVideo} autoPlay playsInline />
            {peerList_duplicateLess.map((peer, id) => {
                return (
                    <Video key={peer.peerID} peer={peer.peer} />
                );
            })}
        </Container>  
        <DefaultButton text="Mic" onClick={toggleCamera} />  
      </Stack>
      <div className="messageContainer">
        <div className="container">
        <InfoBar />   
        <MessageDisplayer messages={messageList} name={username} />   
        
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
        </div>
      </div>
      </Stack>
      
    
    </div>
  )
}

export default Call;
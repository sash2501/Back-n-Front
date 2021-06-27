import React, { useState, useEffect, useRef } from "react";
//import Peer from 'peer';
import Peer from "simple-peer";
import queryString from 'query-string';
import styled from "styled-components";
import { Stack, IStackTokens} from '@fluentui/react/lib/Stack';


import InfoBar from '../MessageBar/MessageBar';
import MessageDisplayer from '../MessageDisplayer/MessageDisplayer';
import IconList from '../IconList/IconList';
import Input from '../Input/Input';
//import OnlinePeople from '../OnlinePeople/OnlinePeople';

import './Call.css';
// client-side
const io = require("socket.io-client");
const ENDPOINT = 'http://localhost:5000'
const stackTokens: IStackTokens = { childrenGap: 20 };

let socket;

const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
    justifyContent: 'center'
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
        <video playsInline autoPlay ref={ref} />
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
  const userVideo = useRef();
  const peersRef = useRef([]);
  const [callEnded, setCallEnded] = useState(false);
  
  useEffect( () => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setUserName(name);
    setRoomName(room);


    //socket = io.connect("/");
    navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
        userVideo.current.srcObject = stream;
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
                peers.push(peer);
            })
            setPeers(peers);
        })

        socket.on("user joined", payload => {
            const peer = addPeer(payload.signal, payload.callerID, stream);
            peersRef.current.push({
                peerID: payload.callerID,
                peer,
            })

            setPeers(users => [...users, peer]);
        });

        socket.on("receiving returned signal", payload => {
            const item = peersRef.current.find(p => p.peerID === payload.id);
            item.peer.signal(payload.signal);
        });
    })

    // return () => {
    //     //disconnect useEffect hook -  unmounting of component
    //     socket.emit('disconnect');

    //     socket.off() //remove the one client instance
    //   }
   
      
    // socket.emit('join', { name, room }, () => { 
    //   return () => {
    //     //disconnect useEffect hook -  unmounting of component
    //     socket.emit('disconnect');

    //     socket.off() //remove the one client instance
    //   }
    // });
  }, [ENDPOINT, location.search]);
  
  ///handling messages recieved - store the messages
  useEffect(() => {
    socket.on('message', (message)=>{
      setMessageList([...messageList, message]);
    });

  },[]);

  function createPeer(userToSignal, callerID, stream) {
        console.log("in create peer");
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
        console.log("in addPeer");
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socket.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

  function leaveCall(video) {
    setCallEnded(true);
    video.remove();

    //peersRef.current.destroy();

    window.location.reload();
  };


  //sending messages
  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  console.log(message, messageList);

  return (
    <div>
      <Stack horizontal tokens={stackTokens}>
      <Stack vertical>
        <IconList room={roomname} leaveCall ={leaveCall} video={userVideo} /> 
        <Container>
            <StyledVideo muted ref={userVideo} autoPlay playsInline />
            {peers.map((peer, index) => {
                return (
                    <Video key={index} peer={peer} />
                );
            })}
        </Container>    
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
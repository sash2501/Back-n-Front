import React, { createContext, useState, useRef, useEffect } from 'react';
import {io} from 'sockect.io-client';
import Peer from 'peerjs';
import queryString from 'query-string';

const SocketContext = createContext();

const ENDPOINT = 'http://localhost:5000'

const socket = io(ENDPOINT);
const userPeer = new Peer(undefined, {
  host: '/',
  port: '5001'
})

const ContextProvider = ({children}) => {

    const [stream, setStream] = useState(null)

    const myVideo = useRef(null);

    useEffect( () => {
      
    const { name, room } = queryString.parse(location.search);
    setUserName(name);
    setRoomName(room);

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
  }, [ENDPOINT, location.search]);

    useEffect(() => {
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      }).then (currentstream => {
            setStream(currentstream);
            myVideo.current.srcObject = currentstream;

            peer.on("call", (call) => {
              call.answer(stream);
              const video = document.createElement("video");
              call.on("stream", (userVideoStream) => {
                addVideoStream(video, userVideoStream);
              });
            });

            socket.on("user-connected", (username) => {
              connectToNewUser(username, stream);
            });
          } 
      
    }, [])

    

  const addOtherUsers = () => {
    const call = peer.call(userId, stream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
  };
}
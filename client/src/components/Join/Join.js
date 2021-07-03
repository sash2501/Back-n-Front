import { useState, useRef, useEffect } from 'react';
import * as React from 'react';
import { Stack, IStackTokens} from '@fluentui/react/lib/Stack';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { TextField } from '@fluentui/react/lib/TextField';
import { Separator } from '@fluentui/react/lib/Separator';
import { createTheme, ITheme } from '@fluentui/react/lib/Styling';
import styled from "styled-components";

import { Link } from "react-router-dom";

import './Join.css';

const stackTokens: IStackTokens = { childrenGap: 20 };

const theme: ITheme = createTheme({
  fonts: {
    medium: {
      fontFamily: 'Monaco, Menlo, Consolas',
      fontSize: '30px',
    },
  },
});

const PreviewVideo = styled.video`
    height: 100%;
    width: 100%;
    display: block;
`;
const Join = () => {

  const [username, setUserName] = useState('');
  const [roomname, setRoomName] = useState(''); //initialize as empty string
  const userVideo = useRef();
  const [mystream, setMyStream] = useState(null)  
  
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        userVideo.current.srcObject = stream;
        setMyStream(stream);
    })
    
  }, [])
  
  return (    
    <div className="wholePage"
    style={{ 
      backgroundImage: `url("https://image.freepik.com/free-vector/elegant-navy-blue-alcohol-ink-background-with-flowers_41066-1470.jpg")`,
      backgroundRepeat: 'no-repeat',
      width: '100vw',
      height: '100vh',
      backgroundSize: 'cover'
    }}><h1><center> SASSYCODE'S TEAMS </center></h1>    
    <div className="LoginBox">   
      <Stack vertical tokens = {stackTokens} horizontalAlign="center">
        <div className="previewVideo">
          <center><PreviewVideo id="myVideo" muted ref={userVideo} autoPlay playsInline />
          <h1>Mute</h1></center>
        </div>
        <div className="InnerContainer">   
          <Stack horizontalAlign="center" tokens = {stackTokens}>
            <Separator theme={theme}>Login</Separator>
            
            <TextField 
              label="User Name" 
              placeholder="Please enter user name here" 
              onChange={event => setUserName(event.target.value)}/>
            <TextField 
              label="Room Name" 
              placeholder="Please enter room name here" 
              onChange={event => setRoomName(event.target.value)}/>
            <Stack.Item align="center" >
              <Link to={`/call?name=${username}&room=${roomname}`}>
                <DefaultButton 
                text="Join-Room" 
                onClick={event => (!username || !roomname)? event.preventDefault() : null} //no response with no input
                />  
              </Link> 
            </Stack.Item>      
          </Stack>
        </div> 
      </Stack>
    </div>    
    </div>
  );
};


// function _alertClicked(): void {
//   alert('Clicked');
// }


export default Join;
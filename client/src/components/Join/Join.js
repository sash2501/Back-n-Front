import { useState } from 'react';
import * as React from 'react';
import { Stack, IStackTokens} from '@fluentui/react/lib/Stack';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { TextField } from '@fluentui/react/lib/TextField';
import { Separator } from '@fluentui/react/lib/Separator';
import { createTheme, ITheme } from '@fluentui/react/lib/Styling';

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

const Join = () => {

  const [username, setUserName] = useState('');
  const [roomname, setRoomName] = useState(''); //initialize as empty string
  
  return (    
    <div><h1><center> SASSYCODE'S TEAMS </center></h1>
    
    <div className="LoginBox">   
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
    </div>    
    </div>
  );
};


// function _alertClicked(): void {
//   alert('Clicked');
// }


export default Join;
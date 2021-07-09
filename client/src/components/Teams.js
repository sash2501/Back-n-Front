import React from 'react';
//import { ChatEngine } from 'react-chat-engine';
import { Link } from "react-router-dom";
import { DefaultButton } from '@fluentui/react/lib/Button';


const projectID = 'c24cbff0-2934-4e83-ab21-d27647cbb9e5';

const Teams = () => {
  let username="sash";
  let roomname="room2";
  return(
    <>
    <h1>teams</h1>
    <Link to={`/call?name=${username}&room=${roomname}`}>
        <DefaultButton 
        text="Join-Room" 
        onClick={event => (!username || !roomname)? event.preventDefault() : null} //no response with no input
        />  
      </Link>
    </>
  )
}

export default Teams;
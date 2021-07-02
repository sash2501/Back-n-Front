import React, { useState } from "react";
import { IIconProps, initializeIcons } from '@fluentui/react';
import { Stack, IStackTokens} from '@fluentui/react/lib/Stack';
import { PrimaryButton, DefaultButton }  from '@fluentui/react/lib/Button';
import { Link } from "react-router-dom";
import { Panel } from '@fluentui/react/lib/Panel';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';

import { useBoolean } from '@fluentui/react-hooks';

// import onlineIcon from '../../icons/onlineIcon.png';
// import closeIcon from '../../icons/closeIcon.png';

import './IconList.css';
import OnlinePeople from '../OnlinePeople/OnlinePeople'

initializeIcons();
const stackTokens: IStackTokens = { childrenGap: 20 };
const endCall: IIconProps = { iconName: 'DeclineCall' };
const micOffIcon: IIconProps = { iconName: 'MicOff' };
const micOnIcon: IIconProps = { iconName: 'Microphone' };
const camOffIcon: IIconProps = { iconName: 'VideoOff' };
const camOnIcon: IIconProps = { iconName: 'Video' };
const screenCast: IIconProps = { iconName: 'ScreenCast' };
const people: IIconProps = { iconName: 'People' };
const peopleAdd: IIconProps = { iconName: 'PeopleAdd' };

const modelProps = {
  isBlocking: false,
  styles: { main: { maxWidth: 450 } },
};

const dialogContentProps = {
  type: DialogType.largeHeader,
  title: 'Participants in the call',
};

const InfoBar = ({ room, media, peer, users}) => {

  //const [muted, { toggle: setMuted }] = useBoolean(false);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [isOpen, { setTrue: openMessage, setFalse: dismissMessage }] = useBoolean(false);
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);

  const toggleCamera = () => {
        // Toggle Webcam on/off
        media.getVideoTracks()[0].enabled = !media.getVideoTracks()[0].enabled;
        //this.setState({ isCameraOn: !this.state.isCameraOn })
        setCameraOff(!cameraOff);

  }
  const toggleMicrophone= () => {
        // Toggle Mic on/off
        media.getAudioTracks()[0].enabled = !media.getAudioTracks()[0].enabled;

        setMuted(!muted);
    }
  
    const shareScreen =() => {
      navigator.mediaDevices.getDisplayMedia({cursor:true})
      .then(screenStream=>{
        console.log("screen sharing");
        // myPeer.replaceTrack(media.getVideoTracks()[0],screenStream.getVideoTracks()[0],media)
        // userVideo.current.srcObject=screenStream
        // screenStream.getTracks()[0].onended = () =>{
        // myPeer.replaceTrack(screenStream.getVideoTracks()[0],stream.getVideoTracks()[0],media)
        // userVideo.current.srcObject=media
        //}
      })
    }


  return(
  <div className="menuBar">
    <div className="roomNameContainer" >
      <h3>Room: {room}</h3>
    </div>
    <div className="commandBar">
      <Stack horizontal tokens={stackTokens}>
        <DefaultButton
          toggle
          checked={muted}
          text={muted ? 'Mic muted' : 'Mic unmuted'}
          iconProps={muted ? micOffIcon : micOnIcon}
          onClick={toggleMicrophone}
        />  
        <DefaultButton
          toggle
          checked={cameraOff}
          text={cameraOff ? 'Cam Off' : 'Cam On'}
          iconProps={cameraOff ? camOffIcon : camOnIcon}
          onClick={toggleCamera}
        />  
        <DefaultButton 
          text="Screen" 
          onClick={shareScreen} 
          iconProps={screenCast}
        />
        <Link to={`/`}>
          <DefaultButton 
          text="End Call" 
          iconProps={endCall}
          />  
        </Link> 
        <DefaultButton 
          secondaryText="See User List" 
          onClick={toggleHideDialog} 
          text="Participants" 
          iconProps={people}
        />      
        <Dialog
          hidden={hideDialog}
          onDismiss={toggleHideDialog}
          dialogContentProps={dialogContentProps}
          modalProps={modelProps}
          minWidth={100}
        >
            <OnlinePeople users={users}/>
            <DialogFooter>
              <Stack tokens={{childrenGap: 10}} horizontal horizontalAlign='center'>
                <PrimaryButton 
                  text="Add Participants"
                  iconProps={peopleAdd}
                />
                <a href="mailto:?subject=I wanted you to see this site&amp;body=Check out this site http://www.website.com."
                  title="Share by Email"
                  target="_blank"
                  rel="noopener noreferrer">
                  <img src="http://png-2.findicons.com/files/icons/573/must_have/48/mail.png"/>
                </a>
                <a href="https://mail.google.com/mail/u/0/?fs=1&su=Join+Sassycode's+Team+meeting&body=User+is+inviting+you+to+a+meeting.%0A%0AJoin+the+meeting:%0Ahttp://localhost:3000/%0A%0AJoin+Room:+_roomname_&tf=cm"
                  title="Share by Gmail"
                  target="_blank"
                  rel="noopener noreferrer">
                  <img src="http://png-2.findicons.com/files/icons/573/must_have/48/mail.png"/>
                </a>
              </Stack>
            </DialogFooter>
          </Dialog>
      </Stack>      
    </div>
  </div>
);
};

export default InfoBar;
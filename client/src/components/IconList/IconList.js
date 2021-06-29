import React, { useState } from "react";
import { IIconProps, initializeIcons } from '@fluentui/react';
import { Stack, IStackTokens} from '@fluentui/react/lib/Stack';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { Link } from "react-router-dom";
import { Panel } from '@fluentui/react/lib/Panel';

import { useBoolean } from '@fluentui/react-hooks';

// import onlineIcon from '../../icons/onlineIcon.png';
// import closeIcon from '../../icons/closeIcon.png';

import './IconList.css';

initializeIcons();
const stackTokens: IStackTokens = { childrenGap: 20 };
const endCall: IIconProps = { iconName: 'DeclineCall' };
const micOffIcon: IIconProps = { iconName: 'MicOff' };
const micOnIcon: IIconProps = { iconName: 'Microphone' };
const camOffIcon: IIconProps = { iconName: 'VideoOff' };
const camOnIcon: IIconProps = { iconName: 'Video' };
const screenCast: IIconProps = { iconName: 'ScreenCast' };

const InfoBar = ({ room, media, peer}) => {

  //const [muted, { toggle: setMuted }] = useBoolean(false);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [isOpen, { setTrue: openMessage, setFalse: dismissMessage }] = useBoolean(false);

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
        <DefaultButton text="Open panel" onClick={openMessage} />
      
        <Panel
          isOpen={isOpen}
          closeButtonAriaLabel="Close"
          isHiddenOnDismiss={true}
          headerText="Message"
          onDismiss={dismissMessage}/>
      </Stack>      
    </div>
  </div>
);
};

export default InfoBar;
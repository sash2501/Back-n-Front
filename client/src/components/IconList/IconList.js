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

const InfoBar = ({ room, media}) => {

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


// function muteMic(stream) {
//   stream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
//   //stream.getAudioTracks()[0].enabled = !(stream.getAudioTracks()[0].enabled);
// }

// function muteCam(stream) {
//   stream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
//   //mediaStream.getVideoTracks()[0].enabled = !(mediaStream.getVideoTracks()[0].enabled); //own
// }
export default InfoBar;
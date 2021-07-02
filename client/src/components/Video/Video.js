import React, { useState, useEffect, useRef } from "react";
import { Stack, IStackTokens} from '@fluentui/react/lib/Stack';

import styled from "styled-components";
import './Video.css'

const VideoCell = styled.video`
    height: 100%;
    width: 100%;
    display: block;
`;

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            console.log("streaming video");
            ref.current.srcObject = stream;
        })
        props.peer.on('close', () => {
            //ref.current.remove();
            console.log("closing peer in video element");
        })
    }, []);

    return (
        console.log("displaying video",props.peer.id),
        <div className="videoCell">
        <Stack vertical>
            <VideoCell playsInline autoPlay ref={ref} />
            <h2><center>user</center></h2>
        </Stack>
        </div>
    );
}

export default Video

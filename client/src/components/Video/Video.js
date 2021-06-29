import React, { useState, useEffect, useRef } from "react";

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
        console.log("displaying video"),
        <video playsInline autoPlay ref={ref} />
    );
}

export default Video

import React, { useState, useEffect } from 'react'
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

function Subtitles(savedNotes) {
  const [subtitles, setSubtitles] = useState([])
  if(savedNotes.length>0) {
  setSubtitles(savedNotes)
  }
  console.log("insubtitlejs",savedNotes)

if(savedNotes.length > 0) {
  savedNotes.map((n) => {
                
                return (                    
                    console.log("sentences",n)
                );})
}
  return (
    <>
        {/* <div className="">
        {subtitles.map(n => (
            <p key={n}>{n}</p>
          ))}
        </div> */}
    </>
  );
  

}

export default Subtitles;
import React, { useState, useEffect } from 'react';
import Map from './Map';
import AI from './AI';

const googleMapsAPIKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export default function MapPage() {

  const [audio, setAudio] = useState('');
  const [advice, setAdvice] = useState('');
  const [visibility, setVisibility] = useState('');
 
  const handleReceiveVisibility = (advice, audio) => {
    setAdvice(advice);
    setAudio(audio);
    setVisibility(true);
    console.log('done')
  };

  return (
    <>
      <Map onSetVisibility={handleReceiveVisibility}/>
      {visibility && (
        <>
        <AI audio={audio} advice={advice}/>
        </>
      )}
    </>
  );
}

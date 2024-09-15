import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './MapPage.css';

const AudioRecorder = () => {

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorderAvailable, setMediaRecorderAvailable] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder.current = new MediaRecorder(stream);

        mediaRecorder.current.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
        };

        mediaRecorder.current.onstop = () => {
          const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
          setAudioBlob(blob);
          audioChunks.current = [];
          setIsProcessing(true); 
          sendAudioToServer(blob);
        };

        setMediaRecorderAvailable(true); 
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
        setMediaRecorderAvailable(false); 
      });
  }, []);

  const startRecording = () => {
    if (mediaRecorderAvailable && mediaRecorder.current) {
      setIsRecording(true);
      mediaRecorder.current.start();
    } else {
      console.error('MediaRecorder is not available.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderAvailable && mediaRecorder.current) {
      setIsRecording(false);
      mediaRecorder.current.stop();
    }
  };

  const sendAudioToServer = async (blob) => {
    
    if (!blob) return;

    const formData = new FormData();
    formData.append('audio', blob, 'audio.webm');

    try {
      const response = await axios.post('http://127.0.0.1:5000/upload-speech', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Server response:', response.data);
      setIsProcessing(false); 
    } catch (error) {
      console.error('Error sending audio to server:', error);
      setIsProcessing(false); 
    }
  };

  const handleButtonClick = () => {
    if (isRecording) {
      stopRecording(); 
    } else {
      startRecording(); 
    }
  };

  return (
    <div>
      <button 
        onClick={handleButtonClick} 
        disabled={!mediaRecorderAvailable || isProcessing}
        className='recording-button'
      >
        {isRecording ? 'Stop Recording' : (isProcessing ? 'Processing...' : 'Start Recording')}
      </button>
    </div>
  );
};

export default AudioRecorder;

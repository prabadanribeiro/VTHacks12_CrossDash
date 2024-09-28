import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './AudioRecorder.css';

export default function AudioRecorder ({ onProccessAudio }) {

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false); 
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorderAvailable, setMediaRecorderAvailable] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const [processingText, setProcessingText] = useState('Processing');

  useEffect(() => {
    let intervalId;

    if (isProcessing) {
      intervalId = setInterval(() => {
        setProcessingText((prevText) => {
          if (prevText === 'Processing') return 'Processing.';
          if (prevText === 'Processing.') return 'Processing..';
          if (prevText === 'Processing..') return 'Processing...';
          return 'Processing';
        });
      }, 500);
    } else {
      setProcessingText('Processing');
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isProcessing]);

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
      await axios.post('http://127.0.0.1:5000/upload-speech', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        const advice = response.data.advice;
        const audio = response.data.audio;
        const hospitals = response.data.hospitals;
        const eta = response.data.eta;
        console.log("working in audio recorders");
        onProccessAudio(advice, audio, hospitals, eta);

        setIsProcessing(false);
        setIsCompleted(true);
      })
      .catch(error => {
        console.error('Error sending audio to server:', error);
        setIsProcessing(false);
      });
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
        disabled={isProcessing || !mediaRecorderAvailable || isCompleted} 
        className={`audio-recording-button ${isProcessing || isCompleted ? 'processing' : ''}`}
      >
        <h1>
          {isRecording ? 'Stop' : (isProcessing ? processingText : isCompleted ? 'Sent' : 'Talk')}
        </h1>
      </button>
    </div>
  );
}
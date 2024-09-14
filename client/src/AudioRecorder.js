import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcription, setTranscription] = useState('');
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  useEffect(() => {
    // Request permission to access the microphone
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder.current = new MediaRecorder(stream);

        // Save chunks of audio data as they become available
        mediaRecorder.current.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
        };

        // When recording stops, create a Blob from the chunks
        mediaRecorder.current.onstop = () => {
          const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
          setAudioBlob(blob);
          audioChunks.current = []; // Reset the audio chunks
        };
      })
      .catch(error => console.error('Error accessing microphone:', error));
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    mediaRecorder.current.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorder.current.stop();
  };

  const sendAudioToServer = async () => {
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.webm'); // Sending as .webm

    try {
      const response = await axios.post('http://localhost:5000/upload-speech', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setTranscription(response.data.message);
      console.log('Server response:', response.data); // Log the response from the server
    } catch (error) {
      console.error('Error sending audio to server:', error);
    }
  };

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {audioBlob && (
        <button onClick={sendAudioToServer}>Send to Server</button>
      )}
      {transcription && (
        <div>
          <h3>Server Response:</h3>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;

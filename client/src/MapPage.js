import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import axios from 'axios'
import './MapPage.css';
import AudioRecorder from './AudioRecorder';

export default function MapPage() {

  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(sendLocation, showError);
    } else {
        console.log('this will display on the top right that it doesnt work')
    }
  }, []);

  const sendLocation = (position) => {

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    axios.get('http://localhost:5000/find-address', {
      params: {
        latitude: latitude,
        longitude: longitude
      }
    })
    .then((response) => {
      setAddress(response.data.address);
    })
    .catch((error) => {
      console.error('Error:', error);
      setErrorMessage('Failed to fetch address');
    });

  };

  const showError = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setErrorMessage('User denied the request for Geolocation.');
        break;
      case error.POSITION_UNAVAILABLE:
        setErrorMessage('Location information is unavailable.');
        break;
      case error.TIMEOUT:
        setErrorMessage('The request to get user location timed out.');
        break;
      case error.UNKNOWN_ERROR:
        setErrorMessage('An unknown error occurred.');
        break;
      default:
        setErrorMessage('An unknown error occurred.');
    }
  };

  return (
    <div className='head'>
      <div className='logo-container' style={{ textDecoration: 'none' }}>
        <Link to="/">
          <h1 style={{ color: 'red', display: 'inline', textDecoration: 'none' }}>Cross</h1>
          <h1 style={{ color: 'black', display: 'inline', textDecoration: 'none' }}>Dash</h1>
        </Link>
        <h1>{address}</h1>
      </div>
      <div className='get-help-stuff'>
        <h1 className='get-help-now' style={{ marginLeft: '5%' }}>Get Help Now</h1>
        <hr style={{width: '90%', height: '3px', backgroundColor: 'black', border: 'none'}} />
      </div>
      <div className='product'>
        <div className='content-container'>
          <div className='map-container'></div>
          <div className='audio-container'>
            <AudioRecorder />
          </div>
        </div>
      </div>
      <div className='help-container'>
        <h1 style={{marginTop: '-50px', marginLeft: '5%'}}>ETA:</h1>
      </div>
    </div>
  );
}

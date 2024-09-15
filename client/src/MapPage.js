import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MapPage.css';
import AudioRecorder from './AudioRecorder';
import Chatbox from './Chatbox';
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
} from '@react-google-maps/api';

export default function MapPage() {
  const [address, setAddress] = useState('');
  const [audio, setAudio] = useState('');
  const [visibility, setVisibility] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [eta, setEta] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [advice, setAdvice] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [map, setMap] = useState(null);

  const mapOptions = {
    disableDefaultUI: true,  // Disables all the default UI controls
    mapTypeControl: false,   // Disables the Map/Satellite toggle
    zoomControl: false,      // Disables the zoom controls
    streetViewControl: false // Disables the street view pegman
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(sendLocation, showError);
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }, []);

  const sendLocation = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    setUserLocation({ lat: latitude, lng: longitude });

    axios
      .get('http://127.0.0.1:5000/find-address', {
        params: {
          latitude: latitude,
          longitude: longitude,
        },
      })
      .then((response) => {
        setAddress(response.data.address);
        setEta(response.data.eta);
        setHospitals(response.data.hospitals);
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrorMessage('Failed to fetch address');
      });
  };

  const handleReceiveAdvice = (advice, audio) => {
    setAdvice(advice);
    setAudio(audio);
    setVisibility(true);
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

  const calculateRoute = () => {
    if (userLocation && hospitals[0]) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: userLocation,
          destination: {
            lat: parseFloat(hospitals[0].lat),
            lng: parseFloat(hospitals[0].lng),
          },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
            const bounds = new window.google.maps.LatLngBounds();
            result.routes[0].legs[0].steps.forEach((step) => {
              bounds.extend(step.start_location);
              bounds.extend(step.end_location);
            });
            map.fitBounds(bounds);
          } else {
            console.error(`Error fetching directions ${result}`);
          }
        }
      );
    }
  };

  useEffect(() => {
    if (visibility) {
      calculateRoute();
    }
  }, [visibility]);

  const onLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  return (
    <div className='head'>
      <div className='logo-container' style={{ textDecoration: 'none' }}>
        <Link to='/'>
          <h1 style={{ color: 'red', display: 'inline', textDecoration: 'none' }}>Cross</h1>
          <h1 style={{ color: 'black', display: 'inline', textDecoration: 'none' }}>Dash</h1>
        </Link>
        <h1>{address}</h1>
      </div>
      <div className='get-help-stuff'>
        <h1 className='get-help-now' style={{ marginLeft: '5%' }}>
          Get Help Now
        </h1>
        <hr style={{ width: '90%', height: '3px', backgroundColor: 'black', border: 'none' }} />
      </div>
      <div className='product'>
        <div className='content-container'>
          <div className='map-container'>
            <LoadScript googleMapsApiKey='AIzaSyA3O80449lCO3pSJzfxgwGpkatd9L4e-9U'>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}  // Set to fill the container
              center={userLocation}
              zoom={14}
              options={mapOptions}
              onLoad={onLoad}
            >
              {userLocation && <Marker position={userLocation} />}
              {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
            </GoogleMap>

            </LoadScript>
          </div>
          <div className='audio-container'>
            <AudioRecorder onReceiveAdvice={handleReceiveAdvice} />
          </div>
        </div>
      </div>
      {visibility && (
        <>
          <div className='eta-header'>
            <h1>ETA: {eta}</h1>
            <h1>{hospitals[0]?.name}</h1>
          </div>
          <div className='help-container'>
            <h2 className={`steps-header ${visibility ? '' : 'center'}`}>Next Steps to Take</h2>
            <div className='advice-and-chat'>
              <div className='advice-container'>
                <h3>{advice}</h3>
              </div>
              <div className='chatbox-container'>
                <Chatbox advice={advice} audio={audio} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

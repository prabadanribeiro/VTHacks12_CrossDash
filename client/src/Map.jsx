import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CrossDash_Logo from './assets/images/CrossDash_Logo.png';
import './Map.css';
import AudioRecorder from './AudioRecorder';
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
} from '@react-google-maps/api';

const googleMapsAPIKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export default function Map({ onSetVisibility }) {
  const [address, setAddress] = useState('');
  const [visibility, setVisibility] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [eta, setEta] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [map, setMap] = useState(null);
  const [loadingDots, setLoadingDots] = useState('');
  const [mapCenter, setMapCenter] = useState(null);

  const mapOptions = {
    disableDefaultUI: true,
    mapTypeControl: false,
    zoomControl: false,
    streetViewControl: false,
    draggableCursor: 'default',
    draggingCursor: 'grabbing',
    disableDoubleClickZoom: true,
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(sendLocation, showError);
    }
  }, []);

  useEffect(() => {
    if (visibility) {
      calculateRoute();
    }
  }, [visibility]);

  const onLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  const sendLocation = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setUserLocation({ lat: latitude, lng: longitude });
    setMapCenter({ lat: latitude, lng: longitude });
    updateAddress(latitude, longitude);
  };
  

  const updateUserLocation = (latitude, longitude) => {
    setUserLocation({ lat: latitude, lng: longitude });
    updateAddress(latitude, longitude);
  };

  const updateAddress = (latitude, longitude) => {
    const dotsInterval = setInterval(() => {
      setLoadingDots((prev) => {
        if (prev.length < 3) {
          return prev + '.';
        }
        return '';
      });
    }, 500);

    axios
      .get('http://127.0.0.1:5000/find-address', {
        params: {
          latitude: latitude,
          longitude: longitude,
        },
      })
      .then((response) => {
        clearInterval(dotsInterval);
        setAddress(response.data.address);
        setLoadingDots('');
      })
      .catch((error) => {
        clearInterval(dotsInterval);
        console.error('Error:', error);
        setErrorMessage('Failed to fetch address');
        setLoadingDots('');
      });
  };

  const startEtaCountdown = (initialEta) => {
    setEta(initialEta);
    const intervalId = setInterval(() => {
      setEta((prevEta) => {
        if (prevEta.length <= 1) {
          clearInterval(intervalId);
          return prevEta;
        }
        return prevEta.slice(1);
      });
    }, 60000);
  };

  const handleProccessAudio = (advice, audio, hospitals, eta) => {
    setEta(eta);
    setHospitals(hospitals);
    setVisibility(true);
    startEtaCountdown(eta);
    onSetVisibility(advice, audio);
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
            setUserLocation(null);
          } else {
            console.error(`Error fetching directions ${result}`);
          }
        }
      );
    }
  };
  

  return (
    <div className='map'>
      <div className='map-header'>
        <div className='map-logo-container'>
          <Link to='/' className='map-logo-link' style={{ textDecoration: 'none' }}>
            <h1>
              <span className='map-header-cross'>Cross</span>
              <span className='map-header-dash'>Dash</span>
            </h1>
            <img className='map-logo-img' src={CrossDash_Logo} alt="CrossDash Logo" />
          </Link>
        </div>
        <div className='address-container'>
          <h1>Address: {address ? address : loadingDots}</h1>
        </div>
      </div>
      <div className='get-help-container'>
        <hr className='help-hr'/>
        <div className='get-help-text-container'>
          <h1>Get Help Now</h1>
        </div>
      </div>
      <div className='googlemap-container'>
        <div className='googlemap-instructions'>
          <ul>
            <li>The map will automatically find your current location and display it.</li>
            <li>If your location is incorrect, double-click on the correct spot on the map to update it.</li>
            <li>Once ready, press the "Talk" button to provide detailed information about your emergency.</li>
            <li>Press the "Stop" button when finished to send your information to 911 and receive AI-generated assistance.</li>
          </ul>
        </div>
        <div className='googlemap-action-container'>
          <div className='googlemap-map-container'>
            <LoadScript googleMapsApiKey={`${googleMapsAPIKey}`}>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={mapCenter} 
              zoom={15}
              options={mapOptions}
              onLoad={onLoad}
              onDblClick={(e) => updateUserLocation(e.latLng.lat(), e.latLng.lng())}
            >
              {userLocation && <Marker position={userLocation} />}
              {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
            </GoogleMap>
            </LoadScript>
          </div>
          <div className='audio-container'>
            <AudioRecorder onProccessAudio={handleProccessAudio} />
          </div>
          {visibility && (
            <div className='eta-container'>
              <h1>ETA: {eta[0]} Minutes</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
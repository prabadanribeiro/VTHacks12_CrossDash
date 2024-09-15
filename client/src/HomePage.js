import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ambulance from './assets/images/ambulance.jpg';
import CrossDash_Logo from './assets/images/CrossDash_Logo.png';
import './HomePage.css'

export default function HomePage() {

  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/members')
      .then(response => {
        setData(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  return (
    <div className='head'>
      <div className='logo-container'>
        <h1 style={{color: 'red'}}>Cross</h1><h1 style={{color: 'black'}}>Dash</h1>
        <img className='LogoStyling'src={CrossDash_Logo} alt="logo" />
      </div>

      <h1>Members</h1>
      {data ? (
        <ul>
          {data.members.map((member, index) => (
            <li key={index}>{member}</li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
      <div>
        <h1>GET HELP</h1>
        <Link to={'/map'}>Click</Link>
      </div>
      <div>
        <img src={ambulance} alt='hospital' />
      </div>
      <h1>What We Do</h1>
      <p>
        We are an emergency help service that connects you to 911 while our AI provides the necessary information to the dispatcher
        after listening to your situation. Our AI will give you the basic first aid instructions needed based on the injury that occured,
        allowing you to give your full attention to help the injured in need.
      </p>
      <h1>Hotline & Helpline Services</h1>
      <p>
        <h2>Suicide and Crisis Hotline:</h2> 988 <br/>
        Disaster Distress Helpline: 1-800-985-5990 <br/>
        Poison Help Hotline 1-800-222-1222<br/>
        Substance Abuse and Mental Health Services Administration’s National Helpline 1-800-662-HELP (1-800-622-4357) <br/>
      </p>
    </div>
  );
}
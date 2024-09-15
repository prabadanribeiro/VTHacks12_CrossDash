import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ambulance from './assets/images/ambulance.jpg';
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
        <h1>Button</h1>
        <Link to={'/map'}>Click</Link>
      </div>
      <div>
        <img src={ambulance} alt='hospital' />
      </div>
    </div>
  );
}
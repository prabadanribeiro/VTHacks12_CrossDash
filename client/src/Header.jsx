import React from 'react';
import { Link } from 'react-router-dom';
import CrossDash_Logo from './assets/images/CrossDash_Logo.png';
import './Header.css';

export default function Header() {

  return (
    <div className='header'>
      <header className='header-container'>
        <div className='header-logo-container'>
          <h1>
            <span className='header-logo-cross'>Cross</span>
            <span className='header-logo-dash'>Dash</span>
          </h1>
          <img className='header-logo-img' src={CrossDash_Logo} alt="CrossDash Logo"/>
        </div>
        <div className='header-text'>
          <div className="header-sentence">
            <h1>We call 911 for you while our AI provides real-time, tailored first-aid guidance</h1>
          </div>
          <div className="cta-container">
              <Link to={'/map'}>
                <div className='cta-button'>
                  <h1>Get Emergency Help</h1>
                </div>
              </Link>
          </div>
        </div>
      </header>
    </div>
  )
    
}
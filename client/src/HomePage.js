import React from 'react';
import { Link } from 'react-router-dom';
import CrossDash_Logo from './assets/images/CrossDash_Logo.png';
import './HomePage.css';

export default function HomePage() {
  return (
    <>
      <header className='head'>
        {/* First Half Section */}
        <div className='first-half'>
          <div className='logo-container1'>
            <h1>
              <span style={{ color: 'red' }}>Cross</span>
              <span style={{ color: 'black' }}>Dash</span>
            </h1>
            <img className='LogoStyling1' src={CrossDash_Logo} alt="CrossDash Logo" />
          </div>
          {/* What We Do Section (Left Side) */}
          <section className="what-we-do">
            <h1>What We Do</h1>
            <p>
              We are an emergency help service that connects you to 911 while our AI provides necessary information to the dispatcher 
              after listening to your situation. Our AI will also offer basic first-aid instructions tailored to the injury that occurred, 
              allowing you to give your full attention to helping the injured person in need. 
              Your safety and well-being are our priority.
            </p>
          </section>

          {/* Call to Action (Right Side) */}
          <div className="cta-container">
            <h1>Get Emergency Help Now</h1>
            <Link to={'/map'}>Click Here</Link>
          </div>
        </div>
      </header>

      {/* Helplines Section */}
      <div className="helpline-section">
        <h1>Hotline & Helpline Services</h1>
        
        <div>
          <h2>Suicide and Crisis Hotline:</h2>
          <p>988</p>
        </div>
        
        <div>
          <span>Disaster Distress Helpline: 1-800-985-5990</span>
          <span>Poison Help Hotline: 1-800-222-1222</span>
          <span>Substance Abuse and Mental Health Services Administration’s National Helpline: 1-800-662-HELP (1-800-622-4357)</span>
        </div>
      </div>

    </>
  );
}
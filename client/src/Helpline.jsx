import React from 'react';
import './Helpline.css';

export default function Helpline() {
  return (
    <div style={{backgroundColor: '#f1e9e9', width: '100%'}}>
      <div style={{width: '100%', height: '100px', backgroundColor: '#f1e9e9'}}></div>
      <div className='bar'>
        <div className='bar-wwd-container'>
          <h1>
            What Do We Do?
          </h1>
        </div>
        <div className='bar-paragraph-container'>
          <span>
              We are an emergency help service that connects you to 911 while our AI provides necessary information to the dispatcher 
              after listening to your situation. Our AI will also offer basic first-aid instructions tailored to the injury that occurred, 
              allowing you to give your full attention to helping the injured person in need. 
              Your safety and well-being are our priority.
          </span>
        </div>
      </div>
      <div className='bar' style={{marginTop: '100px'}}> 
        <div className='helpline-header'>
          <h1>
            Hotline & Helpline Services
          </h1>
        </div>
        <div className="helpline-section">
          <div>
            <h2>Suicide and Crisis Hotline: 988</h2>
          </div>
          <div className="helpline-span">
            <span>Disaster Distress Helpline: 1-800-985-5990</span>
            <span>Poison Help Hotline: 1-800-222-1222</span>
            <span>Substance Abuse and Mental Health Services Administration’s National Helpline: 1-800-662-HELP (1-800-622-4357)</span>
          </div>
        </div>
      </div>
      <div style={{height: '100px', width: '100%', backgroundColor: '#f9f9f9'}}>
      </div>
    </div>
  )
}
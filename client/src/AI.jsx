import React, { useState, useEffect } from 'react';
import Chatbox from './Chatbox';
import './AI.css'

export default function AI({ audio, advice }) {

  return (
    <div className='AI'>
      <div className='next-steps-header-container'>
        <hr className='next-steps-hr'/>
        <div className='next-steps-text-container'>
          <h2>Next Steps to Take</h2>
        </div>
      </div>
      <div className='next-steps-container'>
        <div className='AI-bar'>
          <div className='AI-advice-text'>
            <h1>AI Generated Advice</h1>
          </div>
          <div className='AI-advice-container'>
            <h3>
              {advice
                .split('-')
                .filter(item => item.trim() !== '')
                .map((item, index, array) => (
                  <span key={index}>
                    {item.trim()}
                    {index < array.length - 1 && (
                      <>
                        <br />
                        <br />
                      </>
                    )}
                  </span>
                ))}
            </h3>
          </div>
        </div>
        <div className='AI-bar'>
          <div className='AI-advice-text'>
            <h1>
              AI Assistant Chatbox
            </h1>
          </div>
          <div className='chatbox-container'>
            <Chatbox advice={advice} audio={audio} />
          </div>
        </div>
      </div>
    </div>
  )
}
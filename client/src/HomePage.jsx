import React from 'react';
import { Link } from 'react-router-dom';
import CrossDash_Logo from './assets/images/CrossDash_Logo.png';
import Header from './Header';
import Helpline from './Helpline';

export default function HomePage() {
  return (
    <>
      <Header />
      <Helpline />
    </>
  );
}
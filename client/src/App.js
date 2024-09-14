import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, RouterProvider } from 'react-router-dom';
import { createRouter } from './Router';
import axios from 'axios';
import HomePage from './HomePage';
import MapPage from './MapPage';

export default function App() {

  const router = createRouter();

  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  );
}
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { createRouter } from './Router';

export default function App() {

  const router = createRouter();

  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  );
}
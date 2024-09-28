import React from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import HomePage from './HomePage';
import MapPage from './MapPage';

const Root = () => {
  return (
    <>
      <div>
        <Outlet />
      </div>
    </>
  )
}

export const createRouter = () => {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "",
          element: <HomePage />
        },
        {
          path: "/map",
          element: <MapPage />
        }
      ]
    }
  ])

  return router;
}
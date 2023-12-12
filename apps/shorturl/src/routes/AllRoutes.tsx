import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import AllUrl from '../pages/AllUrl';
import Analytics from '../pages/Analytics';

export const AllRoutes:React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/all-urls" element={<AllUrl/>} />
      <Route path="/analytics/:short_id" element={<Analytics/>} />
    </Routes>
  )
}

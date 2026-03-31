import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

function PublicLayout() {
  return (
    <div className="landing-container">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default PublicLayout;
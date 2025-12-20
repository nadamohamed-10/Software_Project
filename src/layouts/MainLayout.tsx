import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import Header from '../components/navigation/Header';
import MobileNav from '../components/navigation/MobileNav';
import '../styles/layouts/MainLayout.css';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="main-layout">
      <MobileNav />
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="layout-container">
        <Sidebar isOpen={sidebarOpen} />
        <main className="main-content">
          <div className="container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
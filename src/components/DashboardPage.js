import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Footer from './Footer';
import Dashboard from './Dashboard';
import InventoryManagement from './InventoryManagement';
import OrdersManagement from './OrdersManagement';
import SuppliersManagement from './SuppliersManagement';
import ReportsAnalytics from './ReportsAnalytics';
import SettingsPreferences from './SettingsPreferences';

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <InventoryManagement />;
      case 'orders':
        return <OrdersManagement />;
      case 'suppliers':
        return <SuppliersManagement />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'settings':
        return <SettingsPreferences />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-dark-bg">
          {renderCurrentPage()}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardPage;

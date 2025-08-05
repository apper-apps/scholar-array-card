import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    if (path.startsWith("/students")) return "Students";
    if (path.startsWith("/grades")) return "Grades";
    if (path.startsWith("/attendance")) return "Attendance";
    if (path.startsWith("/classes")) return "Classes";
    return "ScholarHub";
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex flex-col w-0 flex-1 overflow-hidden lg:ml-64">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          title={getPageTitle()}
        />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Students", href: "/students", icon: "Users" },
    { name: "Grades", href: "/grades", icon: "BookOpen" },
    { name: "Attendance", href: "/attendance", icon: "Calendar" },
    { name: "Classes", href: "/classes", icon: "School" }
  ];

  const isActive = (href) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-gray-900 to-gray-800 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg">
                <ApperIcon name="GraduationCap" className="h-8 w-8 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-bold text-white">ScholarHub</h1>
            </div>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-white border-r-2 border-primary"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <ApperIcon
                  name={item.icon}
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    isActive(item.href) ? "text-primary" : "text-gray-400 group-hover:text-gray-300"
                  }`}
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 to-gray-800 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex flex-col h-full pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center justify-between flex-shrink-0 px-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg">
                <ApperIcon name="GraduationCap" className="h-8 w-8 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-bold text-white">ScholarHub</h1>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <ApperIcon name="X" className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-white border-r-2 border-primary"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <ApperIcon
                  name={item.icon}
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    isActive(item.href) ? "text-primary" : "text-gray-400 group-hover:text-gray-300"
                  }`}
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
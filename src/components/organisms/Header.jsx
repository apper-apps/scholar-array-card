import React, { useContext } from "react";
import { useSelector } from 'react-redux';
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { AuthContext } from '../../App';

const Header = ({ onMenuClick, title = "Dashboard" }) => {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden mr-2"
            >
              <ApperIcon name="Menu" className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {title}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <ApperIcon name="Calendar" className="h-4 w-4" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            {isAuthenticated && (
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-600">
                  Welcome, {user?.firstName || user?.emailAddress || 'User'}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <ApperIcon name="LogOut" className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
            <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-full">
              <ApperIcon name="User" className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
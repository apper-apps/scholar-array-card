import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, icon, trend, color = "primary" }) => {
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    secondary: "text-secondary bg-secondary/10",
    success: "text-green-600 bg-green-100",
    warning: "text-yellow-600 bg-yellow-100",
    error: "text-red-600 bg-red-100"
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <ApperIcon name={icon} className="h-6 w-6" />
          </div>
          {trend && (
            <div className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {value}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
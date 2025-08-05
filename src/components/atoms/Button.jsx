import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  variant = "default", 
  size = "md", 
  className, 
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    default: "bg-gradient-to-r from-primary to-secondary text-white hover:brightness-110 focus:ring-primary/20 shadow-md hover:shadow-lg",
    outline: "border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-200",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-200",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:brightness-110 focus:ring-red-200 shadow-md hover:shadow-lg",
    success: "bg-gradient-to-r from-green-500 to-green-600 text-white hover:brightness-110 focus:ring-green-200 shadow-md hover:shadow-lg"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
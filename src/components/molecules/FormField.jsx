import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";

const FormField = ({ 
  label, 
  error, 
  required, 
  children, 
  className = "",
  ...props 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className={required ? "after:content-['*'] after:text-red-500 after:ml-1" : ""}>
          {label}
        </Label>
      )}
      {children || <Input error={error} {...props} />}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;
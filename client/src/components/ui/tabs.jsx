import React, { useState } from "react";

export const Tabs = ({ children, defaultValue }) => {
  const [active, setActive] = useState(defaultValue);
  
  // Create a context for passing active state and setActive function
  return (
    <div>
      {React.Children.map(children, (child) => {
        // Only clone and pass props to direct children
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { active, setActive });
        }
        return child;
      })}
    </div>
  );
};

export const TabsList = ({ children, className = "", active, setActive }) => (
  <div className={`flex gap-2 ${className}`}>
    {React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { active, setActive });
      }
      return child;
    })}
  </div>
);

export const TabsTrigger = ({ value, children, active, setActive, className = "" }) => (
  <button
    className={`px-4 py-2 text-sm rounded ${
      active === value ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
    } ${className}`}
    onClick={() => setActive(value)}
  >
    {children}
  </button>
);

export const TabsContent = ({ value, active, children, className = "" }) => {
  if (active !== value) return null;
  return <div className={className}>{children}</div>;
};
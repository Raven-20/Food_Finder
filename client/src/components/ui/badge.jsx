import React from "react";

export const Badge = ({ children, className = "", variant = "default", ...props }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    secondary: "bg-gray-300 text-gray-900",
    outline: "border border-gray-400 text-gray-700",
  };

  return (
    <span className={`text-xs font-medium px-2 py-1 rounded ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

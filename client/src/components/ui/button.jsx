import React from "react";

export const Button = ({ children, className = "", variant = "default", size = "base", ...props }) => {
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-800 hover:bg-gray-100",
    ghost: "text-gray-600 hover:bg-gray-100",
    secondary: "bg-gray-200 text-black hover:bg-gray-300",
  };

  const sizeClasses = {
    base: "px-4 py-2 text-sm",
    sm: "px-3 py-1 text-sm",
    icon: "p-2",
  };

  return (
    <button
      className={`rounded-md transition ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

import React from "react";


export const Dialog = ({ open, onOpenChange, children }) => {
  return open ? (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => onOpenChange(false)}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  ) : null;
};

export const DialogTrigger = ({ children }) => children;

export const DialogContent = ({ children }) => <div>{children}</div>;

export const DialogHeader = ({ children }) => <div className="mb-4">{children}</div>;

export const DialogTitle = ({ children }) => <h2 className="text-xl font-semibold">{children}</h2>;

export const DialogDescription = ({ children }) => <p className="text-sm text-gray-500">{children}</p>;

export const DialogFooter = ({ children }) => <div className="mt-4 flex justify-end gap-2">{children}</div>;

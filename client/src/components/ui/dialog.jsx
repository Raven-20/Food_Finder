import React from "react";

export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" 
      onClick={() => onOpenChange(false)}
      style={{ animation: "fadeIn 0.2s ease" }}
    >
      <div 
        className="bg-white rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export const DialogTrigger = ({ children }) => children;

export const DialogContent = ({ className, children }) => (
  <div className={`recipe-detail-modal ${className || ""}`}>{children}</div>
);

export const DialogHeader = ({ children }) => (
  <div className="modal-header flex justify-between items-center mb-4 sticky top-0 bg-white p-4 border-b border-gray-200 z-10">
    {children}
  </div>
);

export const DialogTitle = ({ children }) => (
  <h2 className="text-xl font-semibold">{children}</h2>
);

export const DialogDescription = ({ children }) => (
  <p className="text-sm text-gray-500">{children}</p>
);

export const DialogFooter = ({ children }) => (
  <div className="mt-4 flex justify-end gap-2 p-4 border-t border-gray-200">{children}</div>
);

export const DialogClose = ({ asChild, children }) => {
  if (asChild) return children;
  return (
    <button className="text-gray-500 hover:text-gray-700">Close</button>
  );
};

// Add keyframes for fadeIn animation to document if not already present
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}
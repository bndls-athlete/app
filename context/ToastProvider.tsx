"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Toast = {
  id: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
};

type ToastContextType = {
  addToast: (type: Toast["type"], message: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: Toast["type"], message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, type, message }]);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (toasts.length > 0) {
        setToasts((prevToasts) => prevToasts.slice(1));
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div
        className="fixed space-y-2 z-50"
        style={{ top: "1rem", right: "1rem" }}
      >
        {/* Static Alert for Testing */}
        {/* <div role="alert" className="alert alert-success">
          <div className="flex-1">
            <span>Static Success Alert</span>
          </div>
        </div> */}
        {/* Dynamic Toasts */}
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={`alert alert-${toast.type}`}
          >
            <div className="flex-1">
              <span>{toast.message}</span>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

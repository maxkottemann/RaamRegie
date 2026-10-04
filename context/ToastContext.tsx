"use client";

import { createContext, useContext, useState } from "react";

interface Toast {
  message: string;
  type: "error" | "success" | "info" | "warning";
}

interface ToastContextType {
  toast: Toast | null;
  showToast: (
    message: string,
    type: "error" | "success" | "info" | "warning",
  ) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType>({
  toast: null,
  showToast: () => {},
  hideToast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);

  function triggerToast(
    message: string,
    type: "error" | "success" | "info" | "warning",
  ) {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <ToastContext.Provider
      value={{
        toast,
        showToast: triggerToast,
        hideToast: () => setToast(null),
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

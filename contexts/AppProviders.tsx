"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { QueryProvider } from "./QueryProvider";
import { ToastProvider } from "./ToastContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <QueryProvider>{children}</QueryProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

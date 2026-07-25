"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthUser, LoginResult } from "@/services/auth/types";

export type AuthSession = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
};

type AuthContextValue = {
  session: AuthSession | null;
  isAuthenticated: boolean;
  startSession: (result: LoginResult) => void;
  endSession: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);

  const startSession = useCallback((result: LoginResult) => {
    setSession({
      accessToken: result.access_token,
      tokenType: result.token_type,
      expiresIn: result.expires_in,
      user: result.user,
    });
  }, []);

  const endSession = useCallback(() => {
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      startSession,
      endSession,
    }),
    [session, startSession, endSession],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuthSession() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthSession must be used inside <AuthProvider>");
  }

  return context;
}

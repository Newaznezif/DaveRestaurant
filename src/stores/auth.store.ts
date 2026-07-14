import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, AuthTokens, Session } from "@/types";
import { STORAGE_KEYS } from "@/constants";

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  sessions: Session[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  setTokens: (tokens: AuthTokens) => void;
  setUser: (user: User) => void;
  setSessions: (sessions: Session[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      tokens: null,
      sessions: [],
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: (user, tokens) => {
        set({
          user,
          tokens,
          isAuthenticated: true,
          error: null,
        });
      },

      logout: () => {
        set({
          user: null,
          tokens: null,
          sessions: [],
          isAuthenticated: false,
          error: null,
        });
      },

      setTokens: (tokens) => {
        set({ tokens });
      },

      setUser: (user) => {
        set({ user });
      },

      setSessions: (sessions) => {
        set({ sessions });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        // Only persist non-sensitive data
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
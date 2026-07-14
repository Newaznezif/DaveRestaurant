import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  modals: Record<string, boolean>;
  toasts: ToastNotification[];
}

interface ToastNotification {
  id: string;
  title?: string;
  description?: string;
  type: "default" | "success" | "error" | "warning" | "info";
  duration?: number;
}

interface UIActions {
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  addToast: (toast: Omit<ToastNotification, "id">) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set, get) => ({
      // State
      theme: "system",
      sidebarOpen: true,
      sidebarCollapsed: false,
      modals: {},
      toasts: [],

      // Actions
      setTheme: (theme) => {
        set({ theme });
      },

      toggleSidebar: () => {
        set({ sidebarOpen: !get().sidebarOpen });
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      toggleSidebarCollapsed: () => {
        set({ sidebarCollapsed: !get().sidebarCollapsed });
      },

      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },

      openModal: (modalId) => {
        set({ modals: { ...get().modals, [modalId]: true } });
      },

      closeModal: (modalId) => {
        const { modals } = get();
        set({ modals: { ...modals, [modalId]: false } });
      },

      addToast: (toast) => {
        const id = Math.random().toString(36).substring(2, 9);
        set({ toasts: [...get().toasts, { ...toast, id }] });
      },

      removeToast: (id) => {
        set({ toasts: get().toasts.filter((t) => t.id !== id) });
      },
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
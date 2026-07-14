import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Organization, Branch } from "@/types";

interface TenantState {
  currentOrganization: Organization | null;
  currentBranch: Branch | null;
  organizations: Organization[];
  branches: Branch[];
  isLoading: boolean;
  error: string | null;
}

interface TenantActions {
  setOrganizations: (organizations: Organization[]) => void;
  setBranches: (branches: Branch[]) => void;
  switchOrganization: (organization: Organization) => void;
  switchBranch: (branch: Branch) => void;
  clearTenant: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTenantStore = create<TenantState & TenantActions>()(
  persist(
    (set, get) => ({
      // State
      currentOrganization: null,
      currentBranch: null,
      organizations: [],
      branches: [],
      isLoading: false,
      error: null,

      // Actions
      setOrganizations: (organizations) => {
        set({ organizations });
        // Auto-select first organization if none selected
        if (!get().currentOrganization && organizations.length > 0) {
          set({ currentOrganization: organizations[0] });
        }
      },

      setBranches: (branches) => {
        set({ branches });
        // Auto-select first branch if none selected
        if (!get().currentBranch && branches.length > 0) {
          set({ currentBranch: branches[0] });
        }
      },

      switchOrganization: (organization) => {
        set({ currentOrganization: organization, currentBranch: null });
      },

      switchBranch: (branch) => {
        set({ currentBranch: branch });
      },

      clearTenant: () => {
        set({
          currentOrganization: null,
          currentBranch: null,
          organizations: [],
          branches: [],
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },
    }),
    {
      name: "tenant-storage",
      partialize: (state) => ({
        currentOrganization: state.currentOrganization,
        currentBranch: state.currentBranch,
      }),
    }
  )
);
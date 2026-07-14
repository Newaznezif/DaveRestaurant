import { useTenantStore } from "@/stores/tenant.store";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";

// Placeholder for organization service
const organizationService = {
  getAll: async () => [],
};

// Placeholder for branch service
const branchService = {
  getAll: async () => [],
};

export function useTenant() {
  const {
    currentOrganization,
    currentBranch,
    organizations,
    branches,
    switchOrganization,
    switchBranch,
    clearTenant,
  } = useTenantStore();

  return {
    currentOrganization,
    currentBranch,
    organizations,
    branches,
    switchOrganization,
    switchBranch,
    clearTenant,
  };
}

export function useOrganizations() {
  return useQuery({
    queryKey: QUERY_KEYS.ORGANIZATIONS.ALL,
    queryFn: () => organizationService.getAll(),
  });
}

export function useBranches() {
  return useQuery({
    queryKey: QUERY_KEYS.BRANCHES.ALL,
    queryFn: () => branchService.getAll(),
  });
}
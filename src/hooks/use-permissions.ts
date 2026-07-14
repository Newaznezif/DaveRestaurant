import { useAuthStore } from "@/stores/auth.store";
import { useTenantStore } from "@/stores/tenant.store";
import { UserRole } from "@/types";

// Role hierarchy - higher roles inherit permissions from lower roles
const roleHierarchy: Record<UserRole, UserRole[]> = {
  SUPER_ADMIN: ["SUPER_ADMIN", "RESTAURANT_OWNER", "MANAGER", "CASHIER", "WAITER", "KITCHEN_STAFF", "DELIVERY_DRIVER", "CUSTOMER"],
  RESTAURANT_OWNER: ["RESTAURANT_OWNER", "MANAGER", "CASHIER", "WAITER", "KITCHEN_STAFF", "DELIVERY_DRIVER"],
  MANAGER: ["MANAGER", "CASHIER", "WAITER", "KITCHEN_STAFF"],
  CASHIER: ["CASHIER"],
  WAITER: ["WAITER"],
  KITCHEN_STAFF: ["KITCHEN_STAFF"],
  DELIVERY_DRIVER: ["DELIVERY_DRIVER"],
  CUSTOMER: ["CUSTOMER"],
};

// Permission definitions
const permissions: Record<string, UserRole[]> = {
  "dashboard:view": ["SUPER_ADMIN", "RESTAURANT_OWNER", "MANAGER"],
  "orders:create": ["CASHIER", "WAITER", "MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
  "orders:view": ["CASHIER", "WAITER", "MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
  "orders:cancel": ["MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
  "orders:update": ["WAITER", "MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
  "menu:view": ["MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN", "CASHIER", "WAITER"],
  "menu:edit": ["MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
  "inventory:view": ["MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
  "inventory:manage": ["MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
  "employees:view": ["MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
  "employees:manage": ["MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
  "customers:view": ["MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
  "analytics:view": ["MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
  "reports:view": ["MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
  "settings:view": ["MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
  "pos:access": ["CASHIER", "MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
  "kitchen:access": ["KITCHEN_STAFF", "MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
  "delivery:access": ["DELIVERY_DRIVER", "MANAGER", "RESTAURANT_OWNER", "SUPER_ADMIN"],
};

export function usePermissions() {
  const { user } = useAuthStore();
  const { currentOrganization, currentBranch } = useTenantStore();

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    return roleHierarchy[user.role].includes(role);
  };

  const canAccess = (permission: string): boolean => {
    if (!user) return false;
    const allowedRoles = permissions[permission];
    return allowedRoles ? allowedRoles.includes(user.role) : false;
  };

  return {
    user,
    organization: currentOrganization,
    branch: currentBranch,
    hasRole,
    canAccess,
    isAuthenticated: !!user,
  };
}

export function useRoleCheck(requiredRole: UserRole) {
  const { hasRole } = usePermissions();
  return hasRole(requiredRole);
}
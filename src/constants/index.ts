// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000",
  TIMEOUT: 30000,
} as const;

// Token Configuration
export const TOKEN_CONFIG = {
  ACCESS_TOKEN_KEY: "access_token",
  REFRESH_TOKEN_KEY: "refresh_token",
  TOKEN_REFRESH_BUFFER: 5 * 60 * 1000, // 5 minutes
} as const;

// Route Configuration
export const ROUTES = {
  // Auth routes
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",
  UNAUTHORIZED: "/unauthorized",
  SESSION_EXPIRED: "/session-expired",
  
  // Dashboard routes
  DASHBOARD: "/dashboard",
  OWNER_DASHBOARD: "/dashboard/owner",
  MANAGER_DASHBOARD: "/dashboard/manager",
  CASHIER_DASHBOARD: "/pos",
  KITCHEN_DASHBOARD: "/kitchen",
  DELIVERY_DASHBOARD: "/delivery",
  
  // Feature routes
  ORDERS: "/orders",
  MENU: "/menu",
  INVENTORY: "/inventory",
  EMPLOYEES: "/employees",
  CUSTOMERS: "/customers",
  TABLES: "/tables",
  RESERVATIONS: "/reservations",
  DELIVERY: "/delivery",
  ANALYTICS: "/analytics",
  REPORTS: "/reports",
  SETTINGS: "/settings",
  PROFILE: "/profile",
} as const;

// Role-based route access
export const ROLE_ROUTES: Record<string, string[]> = {
  SUPER_ADMIN: [ROUTES.DASHBOARD, ROUTES.OWNER_DASHBOARD],
  RESTAURANT_OWNER: [ROUTES.OWNER_DASHBOARD, ROUTES.MANAGER_DASHBOARD, ROUTES.CASHIER_DASHBOARD, ROUTES.KITCHEN_DASHBOARD, ROUTES.DELIVERY_DASHBOARD],
  MANAGER: [ROUTES.MANAGER_DASHBOARD, ROUTES.CASHIER_DASHBOARD, ROUTES.KITCHEN_DASHBOARD, ROUTES.ORDERS, ROUTES.MENU, ROUTES.INVENTORY, ROUTES.EMPLOYEES],
  CASHIER: [ROUTES.CASHIER_DASHBOARD, ROUTES.ORDERS],
  WAITER: [ROUTES.ORDERS, ROUTES.TABLES, ROUTES.RESERVATIONS],
  KITCHEN_STAFF: [ROUTES.KITCHEN_DASHBOARD],
  DELIVERY_DRIVER: [ROUTES.DELIVERY_DASHBOARD],
  CUSTOMER: [],
};

// Query keys for TanStack Query
export const QUERY_KEYS = {
  AUTH: {
    PROFILE: ["auth", "profile"],
    SESSIONS: ["auth", "sessions"],
  },
  ORGANIZATIONS: {
    ALL: ["organizations"],
    DETAIL: (id: string) => ["organizations", id],
  },
  BRANCHES: {
    ALL: ["branches"],
    DETAIL: (id: string) => ["branches", id],
  },
  MENU: {
    CATEGORIES: (orgId: string) => ["menu", "categories", orgId],
    PRODUCTS: (orgId: string) => ["menu", "products", orgId],
  },
  ORDERS: {
    ALL: (branchId: string) => ["orders", "list", branchId],
    DETAIL: (id: string) => ["orders", "detail", id],
    KITCHEN: (branchId: string) => ["orders", "kitchen", branchId],
  },
  TABLES: {
    ALL: (branchId: string) => ["tables", branchId],
  },
  RESERVATIONS: {
    ALL: (branchId: string) => ["reservations", branchId],
  },
  EMPLOYEES: {
    ALL: (orgId: string) => ["employees", orgId],
  },
  CUSTOMERS: {
    ALL: (orgId: string) => ["customers", orgId],
  },
  INVENTORY: {
    ALL: (branchId: string) => ["inventory", branchId],
  },
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  SELECTED_ORG: "selected_organization",
  SELECTED_BRANCH: "selected_branch",
  THEME: "theme",
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;
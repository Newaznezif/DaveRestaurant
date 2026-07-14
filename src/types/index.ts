// User types
export type UserRole = 
  | "SUPER_ADMIN"
  | "RESTAURANT_OWNER"
  | "MANAGER"
  | "CASHIER"
  | "WAITER"
  | "KITCHEN_STAFF"
  | "DELIVERY_DRIVER"
  | "CUSTOMER";

export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName?: string;
  displayName: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
  isTwoFactorEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
  organizationId?: string;
  branchId?: string;
  organization?: Organization;
  branch?: Branch;
  employee?: Employee;
  customer?: Customer;
}

// Organization types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  timezone?: string;
  currency?: string;
  createdAt: string;
  updatedAt: string;
}

// Branch types
export interface Branch {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone?: string;
  email?: string;
  openingTime?: string;
  closingTime?: string;
  isActive: boolean;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

// Employee types
export interface Employee {
  id: string;
  employeeId: string;
  position: string;
  department?: string;
  hireDate?: string;
  salary?: number;
  isActive: boolean;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
}

// Customer types
export interface Customer {
  id: string;
  loyaltyPoints: number;
  loyaltyTier: string;
  totalOrders: number;
  totalSpent: number;
}

// Menu types
export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  organizationId: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  cost?: number;
  image?: string;
  sku?: string;
  barcode?: string;
  isActive: boolean;
  isAvailable: boolean;
  categoryId: string;
  modifiers?: Modifier[];
  variants?: ProductVariant[];
}

export interface Modifier {
  id: string;
  name: string;
  price: number;
  isRequired: boolean;
  options: ModifierOption[];
}

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  sku?: string;
}

// Order types
export type OrderStatus = 
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "COMPLETED"
  | "CANCELLED";

export type OrderType = "DINE_IN" | "TAKEOUT" | "DELIVERY";

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  type: OrderType;
  tableId?: string;
  customerId?: string;
  waiterId?: string;
  branchId: string;
  organizationId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  modifiers: OrderItemModifier[];
}

export interface OrderItemModifier {
  id: string;
  modifierId: string;
  optionId: string;
  price: number;
}

// Table types
export interface Table {
  id: string;
  number: string;
  capacity: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE";
  branchId: string;
}

// Reservation types
export interface Reservation {
  id: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  partySize: number;
  date: string;
  time: string;
  status: "PENDING" | "CONFIRMED" | "SEATED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  tableId?: string;
  notes?: string;
}

// Inventory types
export interface InventoryItem {
  id: string;
  name: string;
  sku?: string;
  barcode?: string;
  currentStock: number;
  minStock: number;
  maxStock?: number;
  unit: string;
  cost: number;
  supplierId?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email?: string;
  phone?: string;
  address?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

// Auth types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  message: string;
}

export interface Session {
  id: string;
  deviceInfo?: string;
  ipAddress?: string;
  userAgent?: string;
  lastUsedAt: string;
  createdAt: string;
  expiresAt: string;
}

// UI types
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  roles: UserRole[];
  children?: NavItem[];
}
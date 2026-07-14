import { z } from "zod";

// Organization schemas
export const organizationSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  slug: z.string().min(1, "Slug is required"),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;

// Branch schemas
export const branchSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  slug: z.string().min(1, "Slug is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  openingTime: z.string().optional(),
  closingTime: z.string().optional(),
  isActive: z.boolean().default(true),
  organizationId: z.string().min(1, "Organization is required"),
});

export type BranchFormData = z.infer<typeof branchSchema>;

// Employee schemas
export const employeeSchema = z.object({
  userId: z.string().min(1, "User is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  position: z.string().min(1, "Position is required"),
  department: z.string().optional(),
  hireDate: z.string().optional(),
  salary: z.number().optional(),
  isActive: z.boolean().default(true),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;

// Customer schemas
export const customerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  loyaltyPoints: z.number().default(0),
  loyaltyTier: z.string().default("BRONZE"),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

// Category schemas
export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  image: z.string().url("Invalid URL").optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
  organizationId: z.string().min(1, "Organization is required"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

// Product schemas
export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  cost: z.number().min(0, "Cost must be positive").optional(),
  image: z.string().url("Invalid URL").optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  isActive: z.boolean().default(true),
  isAvailable: z.boolean().default(true),
  categoryId: z.string().min(1, "Category is required"),
  organizationId: z.string().min(1, "Organization is required"),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Product Variant schemas
export const productVariantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  price: z.number().min(0, "Price must be positive"),
  sku: z.string().optional(),
  productId: z.string().min(1, "Product is required"),
});

export type ProductVariantFormData = z.infer<typeof productVariantSchema>;

// Modifier schemas
export const modifierOptionSchema = z.object({
  name: z.string().min(1, "Option name is required"),
  price: z.number().min(0, "Price must be positive"),
});

export const modifierSchema = z.object({
  name: z.string().min(1, "Modifier name is required"),
  price: z.number().min(0, "Price must be positive"),
  isRequired: z.boolean().default(false),
  options: z.array(modifierOptionSchema).default([]),
});

export type ModifierFormData = z.infer<typeof modifierSchema>;

// Order schemas
export const orderItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  notes: z.string().optional(),
});

export const orderSchema = z.object({
  orderType: z.enum(["DINE_IN", "TAKEOUT", "DELIVERY"]),
  tableId: z.string().optional(),
  customerId: z.string().optional(),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  notes: z.string().optional(),
});

export type OrderFormData = z.infer<typeof orderSchema>;

// Reservation schemas
export const reservationSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email("Invalid email").optional(),
  partySize: z.number().min(1, "Party size must be at least 1"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  tableId: z.string().optional(),
  notes: z.string().optional(),
});

export type ReservationFormData = z.infer<typeof reservationSchema>;

// Inventory schemas
export const inventoryItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  currentStock: z.number().min(0, "Stock must be non-negative"),
  minStock: z.number().min(0, "Min stock must be non-negative"),
  maxStock: z.number().min(0, "Max stock must be non-negative").optional(),
  unit: z.string().min(1, "Unit is required"),
  cost: z.number().min(0, "Cost must be positive"),
  supplierId: z.string().optional(),
  branchId: z.string().min(1, "Branch is required"),
});

export type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;

// Supplier schemas
export const supplierSchema = z.object({
  name: z.string().min(1, "Supplier name is required"),
  contact: z.string().min(1, "Contact is required"),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  total: z.number().optional(),
  totalPages: z.number().optional(),
});

export type PaginationData = z.infer<typeof paginationSchema>;

// Search schema
export const searchSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type SearchParams = z.infer<typeof searchSchema>;
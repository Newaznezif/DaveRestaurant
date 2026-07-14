import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import {
  organizationService,
  branchService,
  menuService,
  ordersService,
  employeesService,
  inventoryService,
  analyticsService,
  customersService,
  reservationsService,
  tablesService,
} from "@/services";
import { Organization, Branch, Category, Product, Employee, Customer, Order, Reservation, Table, InventoryItem, Supplier } from "@/types";

// Organization hooks
export function useOrganizations() {
  return useQuery<Organization[]>({
    queryKey: QUERY_KEYS.ORGANIZATIONS.ALL,
    queryFn: () => organizationService.getAll(),
  });
}

export function useOrganization(id: string) {
  return useQuery<Organization>({
    queryKey: QUERY_KEYS.ORGANIZATIONS.DETAIL(id),
    queryFn: () => organizationService.getById(id),
    enabled: !!id,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Organization>) => organizationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORGANIZATIONS.ALL });
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Organization> }) =>
      organizationService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORGANIZATIONS.ALL });
    },
  });
}

// Branch hooks
export function useBranches(organizationId?: string) {
  return useQuery<Branch[]>({
    queryKey: QUERY_KEYS.BRANCHES.ALL,
    queryFn: () => branchService.getAll(organizationId),
    enabled: !!organizationId,
  });
}

export function useBranch(id: string) {
  return useQuery<Branch>({
    queryKey: QUERY_KEYS.BRANCHES.DETAIL(id),
    queryFn: () => branchService.getById(id),
    enabled: !!id,
  });
}

export function useCreateBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Branch>) => branchService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BRANCHES.ALL });
    },
  });
}

export function useUpdateBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Branch> }) =>
      branchService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BRANCHES.ALL });
    },
  });
}

// Menu hooks
export function useCategories(organizationId: string) {
  return useQuery<Category[]>({
    queryKey: QUERY_KEYS.MENU.CATEGORIES(organizationId),
    queryFn: () => menuService.getCategories(organizationId),
    enabled: !!organizationId,
  });
}

export function useProducts(organizationId: string, categoryId?: string) {
  return useQuery<Product[]>({
    queryKey: QUERY_KEYS.MENU.PRODUCTS(organizationId),
    queryFn: () => menuService.getProducts(organizationId, categoryId),
    enabled: !!organizationId,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Category>) => menuService.createCategory(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MENU.CATEGORIES(variables.organizationId || "") });
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Product>) => menuService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MENU.PRODUCTS("") });
    },
  });
}

// Order hooks
export function useOrders(branchId: string, params?: { status?: string; page?: number; limit?: number }) {
  return useQuery<Order[]>({
    queryKey: QUERY_KEYS.ORDERS.ALL(branchId),
    queryFn: () => ordersService.getAll(branchId, params),
    enabled: !!branchId,
  });
}

export function useOrder(id: string) {
  return useQuery<Order>({
    queryKey: QUERY_KEYS.ORDERS.DETAIL(id),
    queryFn: () => ordersService.getById(id),
    enabled: !!id,
  });
}

export function useKitchenOrders(branchId: string) {
  return useQuery<Order[]>({
    queryKey: QUERY_KEYS.ORDERS.KITCHEN(branchId),
    queryFn: () => ordersService.getKitchenOrders(branchId),
    enabled: !!branchId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ordersService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.ALL("") });
    },
  });
}

// Employee hooks
export function useEmployees(organizationId: string) {
  return useQuery<Employee[]>({
    queryKey: QUERY_KEYS.EMPLOYEES.ALL(organizationId),
    queryFn: () => employeesService.getAll(organizationId),
    enabled: !!organizationId,
  });
}

export function useEmployee(id: string) {
  return useQuery<Employee>({
    queryKey: ["employees", id],
    queryFn: () => employeesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Employee>) => employeesService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EMPLOYEES.ALL("") });
    },
  });
}

// Customer hooks
export function useCustomers(organizationId: string) {
  return useQuery<Customer[]>({
    queryKey: QUERY_KEYS.CUSTOMERS.ALL(organizationId),
    queryFn: () => customersService.getAll(organizationId),
    enabled: !!organizationId,
  });
}

export function useCustomer(id: string) {
  return useQuery<Customer>({
    queryKey: ["customers", id],
    queryFn: () => customersService.getById(id),
    enabled: !!id,
  });
}

// Inventory hooks
export function useInventory(branchId: string) {
  return useQuery<InventoryItem[]>({
    queryKey: QUERY_KEYS.INVENTORY.ALL(branchId),
    queryFn: () => inventoryService.getAll(branchId),
    enabled: !!branchId,
  });
}

export function useLowStock(branchId: string) {
  return useQuery<InventoryItem[]>({
    queryKey: ["inventory", "low-stock", branchId],
    queryFn: () => inventoryService.getLowStock(branchId),
    enabled: !!branchId,
  });
}

export function useSuppliers(organizationId: string) {
  return useQuery<Supplier[]>({
    queryKey: ["suppliers", organizationId],
    queryFn: () => inventoryService.getSuppliers(organizationId),
    enabled: !!organizationId,
  });
}

// Reservation hooks
export function useReservations(organizationId: string, branchId?: string) {
  return useQuery<Reservation[]>({
    queryKey: QUERY_KEYS.RESERVATIONS.ALL(branchId || ""),
    queryFn: () => reservationsService.getAll(organizationId, branchId),
    enabled: !!organizationId,
  });
}

export function useReservationsByDate(branchId: string, date: string) {
  return useQuery<Reservation[]>({
    queryKey: ["reservations", "date", branchId, date],
    queryFn: () => reservationsService.getByDate(branchId, date),
    enabled: !!branchId && !!date,
  });
}

// Table hooks
export function useTables(branchId: string) {
  return useQuery<Table[]>({
    queryKey: QUERY_KEYS.TABLES.ALL(branchId),
    queryFn: () => tablesService.getAll(branchId),
    enabled: !!branchId,
  });
}

// Analytics hooks
export function useDashboardStats(organizationId: string, branchId?: string) {
  return useQuery({
    queryKey: ["analytics", "dashboard", organizationId, branchId],
    queryFn: () => analyticsService.getDashboardStats(organizationId, branchId),
    enabled: !!organizationId,
    refetchInterval: 60000, // Refetch every minute
  });
}
import { apiClient } from "./api-client";
import { InventoryItem, Supplier } from "@/types";

class InventoryService {
  async getAll(branchId: string) {
    const response = await apiClient.get<InventoryItem[]>("/inventory", {
      params: { branchId },
    });
    return response.data;
  }

  async getById(id: string) {
    const response = await apiClient.get<InventoryItem>(`/inventory/${id}`);
    return response.data;
  }

  async create(data: Partial<InventoryItem>) {
    const response = await apiClient.post<InventoryItem>("/inventory", data);
    return response.data;
  }

  async update(id: string, data: Partial<InventoryItem>) {
    const response = await apiClient.patch<InventoryItem>(`/inventory/${id}`, data);
    return response.data;
  }

  async delete(id: string) {
    const response = await apiClient.delete(`/inventory/${id}`);
    return response.data;
  }

  async getLowStock(branchId: string) {
    const response = await apiClient.get<InventoryItem[]>("/inventory/low-stock", {
      params: { branchId },
    });
    return response.data;
  }

  async getSuppliers(organizationId: string) {
    const response = await apiClient.get<Supplier[]>("/suppliers", {
      params: { organizationId },
    });
    return response.data;
  }

  async createSupplier(data: Partial<Supplier>) {
    const response = await apiClient.post<Supplier>("/suppliers", data);
    return response.data;
  }

  async updateSupplier(id: string, data: Partial<Supplier>) {
    const response = await apiClient.patch<Supplier>(`/suppliers/${id}`, data);
    return response.data;
  }

  async getStockMovements(branchId: string) {
    // TODO: Implement when backend endpoint is available
    return [];
  }
}

export const inventoryService = new InventoryService();
export default InventoryService;

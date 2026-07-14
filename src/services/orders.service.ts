import { apiClient } from "./api-client";
import { Order } from "@/types";

class OrdersService {
  async getAll(branchId: string, params?: { status?: string; page?: number; limit?: number }) {
    const response = await apiClient.get<Order[]>("/orders", {
      params: { branchId, ...params },
    });
    return response.data;
  }

  async getById(id: string) {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    return response.data;
  }

  async getByNumber(orderNumber: string) {
    const response = await apiClient.get<Order>(`/orders/number/${orderNumber}`);
    return response.data;
  }

  async getKitchenOrders(branchId: string) {
    const response = await apiClient.get<Order[]>("/orders/kitchen", {
      params: { branchId },
    });
    return response.data;
  }

  async create(data: Partial<Order>) {
    const response = await apiClient.post<Order>("/orders", data);
    return response.data;
  }

  async updateStatus(id: string, status: string) {
    const response = await apiClient.patch<Order>(`/orders/${id}/status`, { status });
    return response.data;
  }

  async updateItemStatus(itemId: string, status: string) {
    const response = await apiClient.patch(`/orders/items/${itemId}/status`, { status });
    return response.data;
  }
}

export const ordersService = new OrdersService();
export default OrdersService;
import { apiClient } from "./api-client";
import { Customer } from "@/types";

class CustomersService {
  async getAll(organizationId: string) {
    const response = await apiClient.get<Customer[]>("/customers", {
      params: { organizationId },
    });
    return response.data;
  }

  async getById(id: string) {
    const response = await apiClient.get<Customer>(`/customers/${id}`);
    return response.data;
  }

  async search(organizationId: string, query: string) {
    const response = await apiClient.get<Customer[]>("/customers/search", {
      params: { organizationId, q: query },
    });
    return response.data;
  }

  async updateLoyalty(id: string, points: number) {
    const response = await apiClient.patch<Customer>(`/customers/${id}/loyalty`, { points });
    return response.data;
  }

  async getLoyaltyHistory(id: string) {
    // TODO: Implement when backend endpoint is available
    return [];
  }
}

export const customersService = new CustomersService();
export default CustomersService;
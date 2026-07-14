import { apiClient } from "./api-client";
import { Branch } from "@/types";

class BranchService {
  async getAll(organizationId?: string) {
    const response = await apiClient.get<Branch[]>("/branches", {
      params: { organizationId },
    });
    return response.data;
  }

  async getById(id: string) {
    const response = await apiClient.get<Branch>(`/branches/${id}`);
    return response.data;
  }

  async create(data: Partial<Branch>) {
    const response = await apiClient.post<Branch>("/branches", data);
    return response.data;
  }

  async update(id: string, data: Partial<Branch>) {
    const response = await apiClient.patch<Branch>(`/branches/${id}`, data);
    return response.data;
  }

  async delete(id: string) {
    const response = await apiClient.delete(`/branches/${id}`);
    return response.data;
  }

  async search(organizationId: string, query: string) {
    const response = await apiClient.get<Branch[]>("/branches/search", {
      params: { organizationId, q: query },
    });
    return response.data;
  }
}

export const branchService = new BranchService();
export default BranchService;

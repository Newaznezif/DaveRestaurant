import { apiClient } from "./api-client";
import { Organization, ApiResponse } from "@/types";

class OrganizationService {
  async getAll() {
    const response = await apiClient.get<Organization[]>("/organizations");
    return response.data;
  }

  async getById(id: string) {
    const response = await apiClient.get<Organization>(`/organizations/${id}`);
    return response.data;
  }

  async create(data: Partial<Organization>) {
    const response = await apiClient.post<Organization>("/organizations", data);
    return response.data;
  }

  async update(id: string, data: Partial<Organization>) {
    const response = await apiClient.patch<Organization>(`/organizations/${id}`, data);
    return response.data;
  }

  async delete(id: string) {
    const response = await apiClient.delete(`/organizations/${id}`);
    return response.data;
  }

  async search(query: string) {
    const response = await apiClient.get<Organization[]>("/organizations/search", {
      params: { q: query },
    });
    return response.data;
  }
}

export const organizationService = new OrganizationService();
export default OrganizationService;

import { apiClient } from "./api-client";
import { Table } from "@/types";

class TablesService {
  async getAll(branchId: string) {
    const response = await apiClient.get<Table[]>("/tables", {
      params: { branchId },
    });
    return response.data;
  }

  async getById(id: string) {
    const response = await apiClient.get<Table>(`/tables/${id}`);
    return response.data;
  }

  async create(data: Partial<Table>) {
    const response = await apiClient.post<Table>("/tables", data);
    return response.data;
  }

  async update(id: string, data: Partial<Table>) {
    const response = await apiClient.patch<Table>(`/tables/${id}`, data);
    return response.data;
  }

  async updateStatus(id: string, status: string) {
    const response = await apiClient.patch<Table>(`/tables/${id}/status`, { status });
    return response.data;
  }

  async getFloors(branchId: string) {
    // TODO: Implement when backend endpoint is available
    return [];
  }

  async createFloor(data: any) {
    // TODO: Implement when backend endpoint is available
    return data;
  }
}

export const tablesService = new TablesService();
export default TablesService;
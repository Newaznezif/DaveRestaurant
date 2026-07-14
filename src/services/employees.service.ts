import { apiClient } from "./api-client";
import { Employee, User } from "@/types";

class EmployeesService {
  async getAll(organizationId: string) {
    const response = await apiClient.get<Employee[]>("/employees", {
      params: { organizationId },
    });
    return response.data;
  }

  async getById(id: string) {
    const response = await apiClient.get<Employee>(`/employees/${id}`);
    return response.data;
  }

  async create(data: Partial<Employee>) {
    const response = await apiClient.post<Employee>("/employees", data);
    return response.data;
  }

  async update(id: string, data: Partial<Employee>) {
    const response = await apiClient.patch<Employee>(`/employees/${id}`, data);
    return response.data;
  }

  async delete(id: string) {
    const response = await apiClient.delete(`/employees/${id}`);
    return response.data;
  }

  async search(organizationId: string, query: string) {
    const response = await apiClient.get<Employee[]>("/employees/search", {
      params: { organizationId, q: query },
    });
    return response.data;
  }

  async getRoles() {
    // TODO: Implement when backend endpoint is available
    return ["MANAGER", "CASHIER", "WAITER", "KITCHEN_STAFF", "DELIVERY_DRIVER"];
  }

  async getPermissions() {
    // TODO: Implement when backend endpoint is available
    return [];
  }
}

export const employeesService = new EmployeesService();
export default EmployeesService;

import { apiClient } from "./api-client";
import { Reservation } from "@/types";

class ReservationsService {
  async getAll(organizationId: string, branchId?: string) {
    const response = await apiClient.get<Reservation[]>("/reservations", {
      params: { organizationId, branchId },
    });
    return response.data;
  }

  async getById(id: string) {
    const response = await apiClient.get<Reservation>(`/reservations/${id}`);
    return response.data;
  }

  async create(data: Partial<Reservation>) {
    const response = await apiClient.post<Reservation>("/reservations", data);
    return response.data;
  }

  async update(id: string, data: Partial<Reservation>) {
    const response = await apiClient.patch<Reservation>(`/reservations/${id}`, data);
    return response.data;
  }

  async updateStatus(id: string, status: string) {
    const response = await apiClient.patch<Reservation>(`/reservations/${id}/status`, { status });
    return response.data;
  }

  async getByDate(branchId: string, date: string) {
    const response = await apiClient.get<Reservation[]>("/reservations/date", {
      params: { branchId, date },
    });
    return response.data;
  }

  async assignTable(id: string, tableId: string) {
    const response = await apiClient.patch<Reservation>(`/reservations/${id}/table`, { tableId });
    return response.data;
  }
}

export const reservationsService = new ReservationsService();
export default ReservationsService;
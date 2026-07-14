import { apiClient } from "./api-client";

interface AnalyticsData {
  revenue: number;
  orders: number;
  customers: number;
  items: number;
}

class AnalyticsService {
  async getDashboardStats(organizationId: string, branchId?: string) {
    const response = await apiClient.get<AnalyticsData>("/analytics/dashboard", {
      params: { organizationId, branchId },
    });
    return response.data;
  }

  async getSalesReport(organizationId: string, params?: {
    startDate?: string;
    endDate?: string;
    branchId?: string;
  }) {
    const response = await apiClient.get("/analytics/sales", {
      params: { organizationId, ...params },
    });
    return response.data;
  }

  async getPopularItems(organizationId: string, limit = 10) {
    const response = await apiClient.get("/analytics/popular-items", {
      params: { organizationId, limit },
    });
    return response.data;
  }
}

export const analyticsService = new AnalyticsService();
export default AnalyticsService;
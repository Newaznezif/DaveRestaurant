import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { API_CONFIG, TOKEN_CONFIG } from "@/constants";
import { useAuthStore } from "@/stores/auth.store";
import { useTenantStore } from "@/stores/tenant.store";

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const { tokens } = useAuthStore.getState();
        const { currentOrganization, currentBranch } = useTenantStore.getState();

        // Add auth token
        if (tokens?.accessToken) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }

        // Add tenant headers
        if (currentOrganization) {
          config.headers["X-Organization-Id"] = currentOrganization.id;
        }
        if (currentBranch) {
          config.headers["X-Branch-Id"] = currentBranch.id;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Try to refresh token
            const { tokens } = useAuthStore.getState();
            if (tokens?.refreshToken) {
              const response = await this.refreshToken(tokens.refreshToken);
              const { accessToken, refreshToken } = response.data;

              // Update auth store
              useAuthStore.getState().setTokens({
                accessToken,
                refreshToken,
              });

              // Retry original request
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            useAuthStore.getState().logout();
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }

        // Transform error
        return this.handleError(error);
      }
    );
  }

  private async refreshToken(refreshToken: string) {
    return axios.post(
      `${API_CONFIG.BASE_URL}/auth/refresh`,
      { refreshToken },
      { withCredentials: true }
    );
  }

  private handleError(error: AxiosError) {
    const errorData = error.response?.data as any;
    
    return Promise.reject({
      code: errorData?.code || "UNKNOWN_ERROR",
      message: errorData?.message || error.message || "An unexpected error occurred",
      details: errorData?.details,
      status: error.response?.status,
    });
  }

  // HTTP methods
  get<T>(url: string, config?: any) {
    return this.client.get<T>(url, config);
  }

  post<T>(url: string, data?: any, config?: any) {
    return this.client.post<T>(url, data, config);
  }

  put<T>(url: string, data?: any, config?: any) {
    return this.client.put<T>(url, data, config);
  }

  patch<T>(url: string, data?: any, config?: any) {
    return this.client.patch<T>(url, data, config);
  }

  delete<T>(url: string, config?: any) {
    return this.client.delete<T>(url, config);
  }
}

export const apiClient = new ApiClient();
export default apiClient;
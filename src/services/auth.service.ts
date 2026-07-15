import { apiClient } from "./api-client";
import { LoginResponse, User, Session, ApiResponse } from "@/types";

export interface LoginCredentials {
  email: string;
  password: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  role?: string;
  organizationId?: string;
  branchId?: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
}

export interface VerifyEmailData {
  email: string;
  otp: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>("/auth/login", credentials);
    return response.data.data;
  }

  async register(data: RegisterData): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>("/auth/register", data);
    return response.data.data;
  }

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post("/auth/logout", { refreshToken });
  }

  async logoutAll(): Promise<void> {
    await apiClient.post("/auth/logout-all");
  }

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>("/auth/forgot-password", data);
    return response.data.data;
  }

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>("/auth/reset-password", data);
    return response.data.data;
  }

  async verifyEmail(data: VerifyEmailData): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>("/auth/verify-email", data);
    return response.data.data;
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>("/auth/resend-verification", { email });
    return response.data.data;
  }

  async getProfile(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>("/auth/profile");
    return response.data.data;
  }

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>("/auth/profile", data);
    return response.data.data;
  }

  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>("/auth/change-password", data);
    return response.data.data;
  }

  async getSessions(): Promise<Session[]> {
    const response = await apiClient.get<ApiResponse<Session[]>>("/auth/sessions");
    return response.data.data;
  }
}

export const authService = new AuthService();
export default AuthService;
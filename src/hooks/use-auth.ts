import { useAuthStore } from "@/stores/auth.store";
import { authService } from "@/services/auth.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";

export function useAuth() {
  const { user, tokens, isAuthenticated, isLoading, error } = useAuthStore();
  return { user, tokens, isAuthenticated, isLoading, error };
}

export function useProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useQuery({
    queryKey: QUERY_KEYS.AUTH.PROFILE,
    queryFn: () => authService.getProfile(),
    enabled: false, // Only fetch when explicitly called
  }) as any;
}

export function useLogin() {
  const { login, setLoading, setError } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data: any) => {
      login(data.user, {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.PROFILE });
    },
    onError: (error: any) => {
      setError(error.message || "Login failed");
    },
  });
}

export function useLogout() {
  const { logout, tokens } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(tokens?.refreshToken || ""),
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });
}
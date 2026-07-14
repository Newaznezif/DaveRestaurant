import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import { apiClient } from "@/services/api-client";

export function useApiQuery<T>(
  key: string[],
  url: string,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">
) {
  return useQuery<T>({
    queryKey: key,
    queryFn: () => apiClient.get<T>(url).then((res) => res.data),
    ...options,
  });
}

export function useApiMutation<T, V>(
  url: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
  options?: Omit<UseMutationOptions<T, any, V>, "mutationFn">
) {
  return useMutation<T, any, V>({
    mutationFn: (data: V) => {
      switch (method) {
        case "POST":
          return apiClient.post<T>(url, data).then((res) => res.data);
        case "PUT":
          return apiClient.put<T>(url, data).then((res) => res.data);
        case "PATCH":
          return apiClient.patch<T>(url, data).then((res) => res.data);
        case "DELETE":
          return apiClient.delete<T>(url).then((res) => res.data);
      }
    },
    ...options,
  });
}
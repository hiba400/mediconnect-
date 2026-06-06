import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: number;
  isActive: boolean;
  createdAt?: string;
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => fetchApi<User[]>("/Users"),
  });
}

export function useToggleUserActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: string; fullName: string; email: string; isActive: boolean }) =>
      fetchApi(`/Users/${payload.id}`, {
        method: "PUT",
        body: JSON.stringify({
          fullName: payload.fullName,
          email: payload.email,
          isActive: payload.isActive,
        }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

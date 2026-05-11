import { useQuery } from "@tanstack/react-query";
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

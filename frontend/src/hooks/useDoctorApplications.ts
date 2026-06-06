import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";

export interface DoctorApplication {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  specialty: string;
  licenseNumber: string;
  city: string;
  yearsOfExperience: number;
  bio: string;
  documentCount: number;
  status: number;
  submittedAt: string;
}

const statusMap: Record<number, "pending" | "approved" | "rejected"> = {
  0: "pending",
  1: "approved",
  2: "rejected",
};

export function mapApplicationStatus(status: number) {
  return statusMap[status] ?? "pending";
}

export function useDoctorApplications(status?: string) {
  const query = status && status !== "all" ? `?status=${status}` : "";
  return useQuery({
    queryKey: ["doctor-applications", status],
    queryFn: () => fetchApi<DoctorApplication[]>(`/DoctorApplications${query}`),
  });
}

export function useApproveApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchApi(`/DoctorApplications/${id}/approve`, { method: "PUT" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["doctor-applications"] }),
  });
}

export function useRejectApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchApi(`/DoctorApplications/${id}/reject`, { method: "PUT" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["doctor-applications"] }),
  });
}

export async function submitDoctorApplication(payload: {
  userId: string;
  fullName: string;
  email: string;
  specialty: string;
  licenseNumber: string;
  city: string;
  yearsOfExperience: number;
  bio: string;
  documentCount: number;
}) {
  return fetchApi<DoctorApplication>("/DoctorApplications", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

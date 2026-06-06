import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  reason: string;
  status: number;
  patient?: {
    fullName: string;
    email: string;
  };
  doctor?: {
    user?: {
      fullName: string;
    };
    specialty: string;
  };
}

export const appointmentStatusLabel: Record<number, string> = {
  0: "pending",
  1: "confirmed",
  2: "cancelled",
  3: "completed",
};

export function usePatientAppointments(patientId?: string) {
  return useQuery({
    queryKey: ["appointments", "patient", patientId],
    queryFn: () => fetchApi<Appointment[]>(`/Appointments/patient/${patientId}`),
    enabled: !!patientId,
  });
}

export function useDoctorAppointments(doctorId?: string) {
  return useQuery({
    queryKey: ["appointments", "doctor", doctorId],
    queryFn: () => fetchApi<Appointment[]>(`/Appointments/doctor/${doctorId}`),
    enabled: !!doctorId,
  });
}

export function useCancelAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchApi(`/Appointments/${id}/cancel`, { method: "PUT" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
}

export function useConfirmAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchApi(`/Appointments/${id}/confirm`, { method: "PUT" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
}

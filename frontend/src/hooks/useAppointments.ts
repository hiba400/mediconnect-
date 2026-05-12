import { useQuery } from "@tanstack/react-query";
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

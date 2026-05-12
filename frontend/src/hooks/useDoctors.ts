import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";

export interface DoctorProfile {
  id: string;
  userId: string;
  specialty: string;
  bio: string;
  consultationFee: number;
  yearsOfExperience: number;
  city: string;
  user?: {
    fullName: string;
    email: string;
  };
}

const DOCTOR_SERVICE_URL = import.meta.env.VITE_DOCTOR_SERVICE_URL || "http://localhost:5196/api";

export function useDoctors() {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: () => fetchApi<DoctorProfile[]>("/DoctorProfiles", {}, DOCTOR_SERVICE_URL),
  });
}

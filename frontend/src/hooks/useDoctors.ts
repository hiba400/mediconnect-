import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";

export interface DoctorProfile {
  id: string;
  userId: string;
  fullName?: string;
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

type MonolithDoctor = { id: string; fullName: string; email: string };

const DOCTOR_SERVICE_URL =
  import.meta.env.VITE_DOCTOR_SERVICE_URL || "http://localhost:5196/api";

function mergeDoctorUserIds(
  profiles: DoctorProfile[],
  monolithDoctors: MonolithDoctor[]
): DoctorProfile[] {
  return profiles.map((p) => {
    const profileName = (p.fullName ?? p.user?.fullName ?? "").toLowerCase().trim();
    const match = monolithDoctors.find(
      (m) => m.fullName.toLowerCase().trim() === profileName
    );
    return {
      ...p,
      userId: match?.id ?? p.userId,
      fullName: p.fullName ?? p.user?.fullName ?? match?.fullName,
    };
  });
}

export function useDoctors() {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const profiles = await fetchApi<DoctorProfile[]>(
        "/DoctorProfiles",
        {},
        DOCTOR_SERVICE_URL
      );

      try {
        const monolithDoctors = await fetchApi<MonolithDoctor[]>("/Users/doctors");
        return mergeDoctorUserIds(profiles, monolithDoctors);
      } catch {
        return profiles;
      }
    },
  });
}

export function useMonolithDoctors() {
  return useQuery({
    queryKey: ["monolith-doctors"],
    queryFn: () => fetchApi<MonolithDoctor[]>("/Users/doctors"),
  });
}

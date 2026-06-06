import { fetchApi } from "@/lib/api";

const DOCTOR_SERVICE_URL =
  import.meta.env.VITE_DOCTOR_SERVICE_URL || "http://localhost:5196/api";

export async function createDoctorProfile(payload: {
  userId: string;
  fullName: string;
  specialty: string;
  bio: string;
  consultationFee: number;
  yearsOfExperience: number;
  city: string;
}) {
  return fetchApi("/DoctorProfiles/me", {
    method: "POST",
    body: JSON.stringify(payload),
  }, DOCTOR_SERVICE_URL);
}

import type { DoctorProfile } from "@/hooks/useDoctors";

export type DoctorCard = {
  id: string;
  userId: string;
  name: string;
  specialty: string;
  city: string;
  price: number;
  experience: number;
  bio: string;
  avatar: string;
};

export function normalizeDoctor(raw: DoctorProfile): DoctorCard {
  const name = raw.fullName ?? raw.user?.fullName ?? "Doctor";
  return {
    id: raw.id,
    userId: raw.userId,
    name,
    specialty: raw.specialty,
    city: raw.city,
    price: raw.consultationFee,
    experience: raw.yearsOfExperience,
    bio: raw.bio,
    avatar: `https://i.pravatar.cc/150?u=${raw.id}`,
  };
}

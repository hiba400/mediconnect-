export type DoctorApplyPending = {
  fullName: string;
  email: string;
  password: string;
};

const STORAGE_KEY = "mediconnect-doctor-apply-pending";

export function saveDoctorApplyPending(data: DoctorApplyPending) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function readDoctorApplyPending(): DoctorApplyPending | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DoctorApplyPending;
  } catch {
    return null;
  }
}

export function clearDoctorApplyPending() {
  sessionStorage.removeItem(STORAGE_KEY);
}

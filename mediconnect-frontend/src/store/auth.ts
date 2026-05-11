import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "patient" | "doctor" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

interface AuthState {
  user: AuthUser | null;
  theme: "light" | "dark";
  loginAs: (role: Role) => void;
  login: (email: string, _password: string) => void;
  logout: () => void;
  toggleTheme: () => void;
  setUser: (user: AuthUser, token: string) => void;
}

const demoUsers: Record<Role, AuthUser> = {
  patient: { id: "p1", name: "Sarah Mitchell", email: "sarah@demo.com", role: "patient" },
  doctor: { id: "d1", name: "Dr. James Carter", email: "j.carter@demo.com", role: "doctor" },
  admin: { id: "a1", name: "Admin User", email: "admin@demo.com", role: "admin" },
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      theme: "light",
      loginAs: (role) => set({ user: null }), // deprecated with real API
      login: (email) => {
         // deprecated sync method, logic moved to components
      },
      logout: () => {
        localStorage.removeItem("mediconnect-auth-token");
        set({ user: null });
      },
      toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light";
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", next === "dark");
        }
        set({ theme: next });
      },
      setUser: (user: AuthUser, token: string) => {
        localStorage.setItem("mediconnect-auth-token", token);
        set({ user });
      }
    }),
    { name: "mediconnect-auth" }
  )
);

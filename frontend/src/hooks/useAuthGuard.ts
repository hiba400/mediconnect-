import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth, type Role } from "@/store/auth";

const dashboardByRole: Record<Role, "/patient" | "/doctor" | "/admin"> = {
  patient: "/patient",
  doctor: "/doctor",
  admin: "/admin",
};

export function useAuthGuard(requiredRole: Role) {
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();
  const [ready, setReady] = useState(() => useAuth.persist.hasHydrated());

  useEffect(() => {
    if (ready) return;
    return useAuth.persist.onFinishHydration(() => setReady(true));
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      const hasToken =
        typeof localStorage !== "undefined" &&
        !!localStorage.getItem("mediconnect-auth-token");
      if (hasToken) return;
      navigate({ to: "/login", replace: true });
      return;
    }
    if (user.role !== requiredRole) {
      navigate({ to: dashboardByRole[user.role], replace: true });
    }
  }, [ready, user, navigate, requiredRole]);

  return { user, ready };
}

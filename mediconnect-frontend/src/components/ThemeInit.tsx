import { useEffect } from "react";
import { useAuth } from "@/store/auth";

export function ThemeInit() {
  const theme = useAuth((s) => s.theme);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  return null;
}

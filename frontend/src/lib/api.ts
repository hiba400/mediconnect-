function resolveApiBaseUrl(): string {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (import.meta.env.SSR) {
    return process.env.API_URL_SSR ?? "http://localhost:5195/api";
  }
  return "/api";
}

export const API_BASE_URL = resolveApiBaseUrl();

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  baseUrl: string = API_BASE_URL
): Promise<T> {
  const token =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("mediconnect-auth-token")
      : null;

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Impossible de joindre le serveur. Ouvrez http://localhost:8081 et démarrez le backend (docker\\start-backend.ps1)."
      );
    }
    throw error;
  }

  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.title || JSON.stringify(errorData);
    } catch {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

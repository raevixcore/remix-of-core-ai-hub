const API_URL = "https://coreai-clean.replit.app/api";

export { API_URL };

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function getAccessToken(): string | null {
  return localStorage.getItem("access_token");
}

function getRefreshToken(): string | null {
  return localStorage.getItem("refresh_token");
}

function setTokens(access: string, refresh: string) {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
}

function clearAuth() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const res = await fetch(`${API_URL}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) throw new Error("Refresh failed");

  const data = await res.json();
  setTokens(data.access_token, data.refresh_token || refreshToken);
  return data.access_token;
}

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  // Handle 401 — try refresh
  if (res.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        isRefreshing = false;
        refreshQueue.forEach((cb) => cb(newToken));
        refreshQueue = [];

        headers["Authorization"] = `Bearer ${newToken}`;
        res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
      } catch {
        isRefreshing = false;
        refreshQueue = [];
        clearAuth();
        throw new Error("Sessão expirada");
      }
    } else {
      // Wait for ongoing refresh
      const newToken = await new Promise<string>((resolve) => {
        refreshQueue.push(resolve);
      });
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    }
  }

  if (res.status === 403) {
    throw new Error("Você não tem permissão para esta ação");
  }

  if (res.status >= 500) {
    throw new Error("Erro interno do servidor");
  }

  const text = await res.text();
  if (!text) return null;

  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Resposta inválida do servidor");
  }

  if (!res.ok) {
    throw new Error(data?.error || "Erro desconhecido");
  }

  return data;
}

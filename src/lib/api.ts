import { ApiError } from "./errors/ApiError";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
  
type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
};

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<T>(response);
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      data?.error ?? data?.message ?? "Unknown error",
      response.status,
      data
    );
  }

  return data as T;
}

export const api = {
  get: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, { method: "GET", token }),

  post: <T>(endpoint: string, body?: unknown, token?: string) =>
    request<T>(endpoint, { method: "POST", body, token }),

  put: <T>(endpoint: string, body?: unknown, token?: string) =>
    request<T>(endpoint, { method: "PUT", body, token }),

  patch: <T>(endpoint: string, body?: unknown, token?: string) =>
    request<T>(endpoint, { method: "PATCH", body, token }),

  delete: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, { method: "DELETE", token }),
};
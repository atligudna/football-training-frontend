const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type ApiOptions = RequestInit & {
  token?: string;
};

export async function api<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const token =
    options.token ??
    (typeof window !== "undefined"
      ? localStorage.getItem("token") ?? undefined
      : undefined);

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Unknown error");
  }

  return data;
}
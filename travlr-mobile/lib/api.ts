import { API_BASE_URL } from '@/lib/config';
import type { Trip } from '@/lib/types';

let authToken: string | null = null;

// Called from AuthContext when user logs in or logs out
export function setAuthToken(token: string | null) {
  authToken = token;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const message = text || res.statusText || 'Request failed';
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (authToken) {
    (headers as any)['Authorization'] = `Bearer ${authToken}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

// ---- Public API functions for trips ----

export async function fetchTrips(): Promise<Trip[]> {
  const res = await authFetch(`${API_BASE_URL}/trips`);
  return handleResponse<Trip[]>(res);
}

export async function fetchTripByCode(code: string): Promise<Trip> {
  const res = await authFetch(
    `${API_BASE_URL}/trips/${encodeURIComponent(code)}`
  );
  return handleResponse<Trip>(res);
}

// ---- Auth ----

interface AuthResponse {
  token: string;
}

// Matches POST /api/login in your Express app, which expects: { email, password } and returns { token }
export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,    // passport is configured to use 'email'
      password, // and 'password'
    }),
  });

  return handleResponse<AuthResponse>(res);
}

// Matches POST /api/register in your Express app, which expects: { name, email, password } and returns { token }
export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  return handleResponse<AuthResponse>(res);
}

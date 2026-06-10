import type {
  ApiError,
  AuthResponse,
  AutoAffordabilityRequest,
  AutoAffordabilityResponse,
  DebtOptimizationResponse,
  HealthScoreResponse,
  LoginRequest,
  OnboardingResponse,
  UserOnboardingRequest,
  UserResponse,
} from "@/lib/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8001";

async function parseError(response: Response): Promise<ApiError> {
  let details: unknown;
  try {
    details = await response.json();
  } catch {
    details = await response.text();
  }

  const message =
    typeof details === "object" &&
    details !== null &&
    "detail" in details &&
    typeof (details as { detail: unknown }).detail === "string"
      ? (details as { detail: string }).detail
      : `Request failed with status ${response.status}`;

  return { message, status: response.status, details };
}

async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return response.json() as Promise<T>;
}

export async function onboardUser(
  payload: UserOnboardingRequest
): Promise<OnboardingResponse> {
  return apiFetch<OnboardingResponse>("/api/v1/auth/onboard", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: LoginRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchCurrentUser(token: string): Promise<UserResponse> {
  return apiFetch<UserResponse>("/api/v1/auth/me", { method: "GET" }, token);
}

export async function fetchHealthScore(
  userId: number
): Promise<HealthScoreResponse> {
  return apiFetch<HealthScoreResponse>(
    `/api/v1/analytics/health-score/${userId}`
  );
}

export async function fetchDebtOptimization(
  userId: number,
  strategy: "snowball" | "avalanche" = "avalanche"
): Promise<DebtOptimizationResponse> {
  return apiFetch<DebtOptimizationResponse>(
    `/api/v1/optimize/debts/${userId}?strategy=${strategy}`
  );
}

export async function evaluateAutoAffordability(
  payload: AutoAffordabilityRequest
): Promise<AutoAffordabilityResponse> {
  return apiFetch<AutoAffordabilityResponse>(
    "/api/v1/calculator/auto-affordability",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function fetchTaxSummary(
  userId: number
): Promise<any> {
  return apiFetch<any>(
    `/api/v1/analytics/tax/${userId}`
  );
}

export { API_BASE };

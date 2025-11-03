import "server-only";

export type DashboardSummary = {
  revenue: number;
  revenueChange: number;
  orders: number;
  ordersChange: number;
  averageOrderValue: number;
  averageOrderValueChange: number;
  retentionRate: number;
  retentionRateChange: number;
};

export type UserStats = {
  totalUsers: number;
  activeUsers: number;
  newUsers30d: number;
  adminUsers: number;
  managerUsers: number;
  customerUsers: number;
};

export type MonthlyPerformancePoint = {
  month: string;
  revenue: number;
  orders: number;
  profitMargin: number;
  newUsers: number;
};

export type ChannelPerformance = {
  channel: string;
  revenue: number;
  percentage: number;
};

export type TopProduct = {
  name: string;
  orders: number;
  revenue: number;
  conversionRate: number;
};

export type RecentActivity = {
  title: string;
  description: string;
  timestamp: string;
  status: "success" | "warning" | "info";
};

export type TeamFocus = {
  name: string;
  role: string;
  avatarFallback: string;
  metric: string;
  trend: number;
};

export type DashboardData = {
  summary: DashboardSummary;
  userStats: UserStats;
  monthlyPerformance: MonthlyPerformancePoint[];
  channelPerformance: ChannelPerformance[];
  topProducts: TopProduct[];
  recentActivities: RecentActivity[];
  teamFocus: TeamFocus[];
  users: DashboardUser[];
};

type User = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: string;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type DashboardUser = User & {
  fullName: string;
};

type DashboardApiResponse = DashboardData;

const API_BASE_URL = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
const SERVICE_EMAIL = process.env.API_SERVICE_EMAIL ?? process.env.ADMIN_SERVICE_EMAIL;
const SERVICE_PASSWORD = process.env.API_SERVICE_PASSWORD ?? process.env.ADMIN_SERVICE_PASSWORD;

export async function getDashboardData(): Promise<DashboardData> {
  if (!API_BASE_URL || !SERVICE_EMAIL || !SERVICE_PASSWORD) {
    throw new Error("Dashboard API credentials are not configured");
  }

  try {
    const token = await ensureServiceToken();
    const overview = await fetchOverview(token);
    return normaliseOverview(overview);
  } catch (error) {
    console.error("Failed to fetch dashboard data", error);
    throw new Error(
      `Failed to fetch dashboard data: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

async function ensureServiceToken(): Promise<string> {
  const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: SERVICE_EMAIL,
      password: SERVICE_PASSWORD,
    }),
  });

  if (loginResponse.ok) {
    const loginPayload = (await loginResponse.json()) as { access_token: string };
    return loginPayload.access_token;
  }

  const loginBodyText = await safeReadBody(loginResponse);

  if (loginResponse.status !== 401 && loginResponse.status !== 404) {
    throw new Error(
      `Unable to authenticate service user (${loginResponse.status}): ${loginBodyText}`.trim(),
    );
  }

  const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: SERVICE_EMAIL,
      password: SERVICE_PASSWORD,
      firstName: "Operations",
      lastName: "Admin",
      role: "admin",
    }),
  });

  if (registerResponse.ok) {
    const payload = (await registerResponse.json()) as { access_token: string };
    return payload.access_token;
  }

  const registerBodyText = await safeReadBody(registerResponse);
  throw new Error(
    `Service user provisioning failed (register ${registerResponse.status}: ${registerBodyText}; login ${loginResponse.status}: ${loginBodyText})`.trim(),
  );
}

async function safeReadBody(response: Response): Promise<string> {
  try {
    const text = await response.text();
    return text || "<empty response>";
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

async function fetchOverview(token: string): Promise<DashboardApiResponse> {
  const response = await fetch(`${API_BASE_URL}/dashboard/overview`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to load dashboard overview (${response.status})`);
  }

  return (await response.json()) as DashboardApiResponse;
}

function normaliseOverview(data: DashboardApiResponse): DashboardData {
  return {
    ...data,
    users: data.users.map((user) => ({
      ...user,
      createdAt: normaliseDate(user.createdAt),
      updatedAt: normaliseDate(user.updatedAt),
      fullName: user.fullName?.trim() || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email,
    })),
    recentActivities: data.recentActivities.map((activity) => ({
      ...activity,
      status: activity.status,
    })),
  } satisfies DashboardData;
}

function normaliseDate(value: string | Date): string {
  if (!value) return new Date().toISOString();
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
}

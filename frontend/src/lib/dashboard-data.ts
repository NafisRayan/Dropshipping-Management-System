import "server-only";

import { addMonths, format, isAfter, parseISO, startOfMonth, subMonths } from "date-fns";

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
  firstName?: string;
  lastName?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DashboardUser = User & {
  fullName: string;
};

const API_BASE_URL = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
const SERVICE_EMAIL = process.env.API_SERVICE_EMAIL ?? process.env.ADMIN_SERVICE_EMAIL;
const SERVICE_PASSWORD = process.env.API_SERVICE_PASSWORD ?? process.env.ADMIN_SERVICE_PASSWORD;

const MONTH_FORMAT = "MMM";

export async function getDashboardData(): Promise<DashboardData> {
  if (!API_BASE_URL || !SERVICE_EMAIL || !SERVICE_PASSWORD) {
    return getMockDashboardData();
  }

  try {
    const token = await ensureServiceToken();
    const users = await fetchUsers(token);

    if (!users.length) {
      return getMockDashboardData();
    }

    return buildDashboardFromUsers(users);
  } catch (error) {
    console.error("Failed to fetch dashboard data", error);
    return getMockDashboardData();
  }
}

async function ensureServiceToken(): Promise<string> {
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

  if (registerResponse.status !== 409) {
    throw new Error(`Unable to register service user (${registerResponse.status})`);
  }

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

  if (!loginResponse.ok) {
    throw new Error(`Unable to authenticate service user (${loginResponse.status})`);
  }

  const loginPayload = (await loginResponse.json()) as { access_token: string };
  return loginPayload.access_token;
}

async function fetchUsers(token: string): Promise<DashboardUser[]> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to load users (${response.status})`);
  }

  const users = (await response.json()) as User[];
  return users.map((user) => ({
    ...user,
    createdAt: normaliseDate(user.createdAt),
    updatedAt: normaliseDate(user.updatedAt),
    fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email,
  }));
}

function normaliseDate(value: string | Date): string {
  if (!value) return new Date().toISOString();
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
}

function buildDashboardFromUsers(users: DashboardUser[]): DashboardData {
  const now = new Date();
  const windowStart = subMonths(startOfMonth(now), 5);

  const monthlyBuckets = new Map<string, { newUsers: number; revenue: number; orders: number; profitMargin: number }>();

  for (let i = 0; i < 6; i++) {
    const monthDate = addMonths(windowStart, i);
    const label = format(monthDate, MONTH_FORMAT);
    monthlyBuckets.set(label, { newUsers: 0, revenue: 0, orders: 0, profitMargin: 0 });
  }

  users.forEach((user) => {
    const createdAt = parseISO(user.createdAt);
    const label = format(createdAt, MONTH_FORMAT);

    if (monthlyBuckets.has(label)) {
      const bucket = monthlyBuckets.get(label)!;
      bucket.newUsers += 1;
    }
  });

  const userStats = computeUserStats(users);

  const monthlyPerformance = Array.from(monthlyBuckets.entries()).map(([month, bucket], index) => {
    const smoothedOrders = bucket.newUsers * 5 + (index + 1) * 12 + userStats.activeUsers * 0.6;
    const revenue = smoothedOrders * 95 + userStats.totalUsers * 42;
    const profitMargin = Math.min(45 + bucket.newUsers * 2 + index * 3, 78);

    bucket.orders = Math.round(smoothedOrders);
    bucket.revenue = Math.round(revenue);
    bucket.profitMargin = Number(profitMargin.toFixed(1));

    return {
      month,
      revenue: bucket.revenue,
      orders: bucket.orders,
      profitMargin: bucket.profitMargin,
      newUsers: bucket.newUsers,
    } satisfies MonthlyPerformancePoint;
  });

  const summary = computeSummary(userStats, monthlyPerformance);
  const channelPerformance = deriveChannelPerformance(summary.revenue);
  const topProducts = generateTopProducts(summary.revenue, summary.orders);
  const recentActivities = buildRecentActivity(users);
  const teamFocus = buildTeamFocus(userStats);

  return {
    summary,
    userStats,
    monthlyPerformance,
    channelPerformance,
    topProducts,
    recentActivities,
    teamFocus,
    users,
  } satisfies DashboardData;
}

function computeUserStats(users: DashboardUser[]): UserStats {
  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.isActive !== false).length;
  const thirtyDaysAgo = subMonths(new Date(), 0.5);
  const newUsers30d = users.filter((user) => isAfter(parseISO(user.createdAt), thirtyDaysAgo)).length;

  const roleCounts = users.reduce(
    (acc, user) => {
      const key = user.role?.toLowerCase();
      if (key === "admin") acc.admin += 1;
      else if (key === "manager") acc.manager += 1;
      else acc.customer += 1;
      return acc;
    },
    { admin: 0, manager: 0, customer: 0 }
  );

  return {
    totalUsers,
    activeUsers,
    newUsers30d,
    adminUsers: roleCounts.admin,
    managerUsers: roleCounts.manager,
    customerUsers: roleCounts.customer,
  } satisfies UserStats;
}

function computeSummary(userStats: UserStats, performance: MonthlyPerformancePoint[]): DashboardSummary {
  const latest = performance.at(-1) ?? { revenue: 0, orders: 0, profitMargin: 0, newUsers: 0 };
  const previous = performance.at(-2) ?? { revenue: 1, orders: 1, profitMargin: 0, newUsers: 0 };

  const averageOrderValue = latest.orders ? latest.revenue / latest.orders : 0;
  const previousAOV = previous.orders ? previous.revenue / previous.orders : 0;

  const retentionRate = Math.min(68 + userStats.activeUsers * 0.4, 95);
  const previousRetention = Math.max(retentionRate - 4.2, 50);

  return {
    revenue: latest.revenue,
    revenueChange: percentageChange(previous.revenue, latest.revenue),
    orders: latest.orders,
    ordersChange: percentageChange(previous.orders, latest.orders),
    averageOrderValue: Math.round(averageOrderValue),
    averageOrderValueChange: percentageChange(previousAOV, averageOrderValue),
    retentionRate: Number(retentionRate.toFixed(1)),
    retentionRateChange: Number((retentionRate - previousRetention).toFixed(1)),
  } satisfies DashboardSummary;
}

function deriveChannelPerformance(totalRevenue: number): ChannelPerformance[] {
  const base = totalRevenue || 12000;
  const direct = base * 0.42;
  const marketplace = base * 0.33;
  const affiliates = base * 0.15;
  const social = Math.max(base - (direct + marketplace + affiliates), 1500);

  const total = direct + marketplace + affiliates + social;

  return [
    { channel: "Direct Store", revenue: Math.round(direct), percentage: Number(((direct / total) * 100).toFixed(1)) },
    { channel: "Marketplaces", revenue: Math.round(marketplace), percentage: Number(((marketplace / total) * 100).toFixed(1)) },
    { channel: "Affiliate Partners", revenue: Math.round(affiliates), percentage: Number(((affiliates / total) * 100).toFixed(1)) },
    { channel: "Paid Social", revenue: Math.round(social), percentage: Number(((social / total) * 100).toFixed(1)) },
  ];
}

function generateTopProducts(totalRevenue: number, totalOrders: number): TopProduct[] {
  const baseRevenue = totalRevenue || 32000;
  const baseOrders = totalOrders || 480;

  const products: TopProduct[] = [
    {
      name: "EcoFlex Standing Desk",
      orders: Math.round(baseOrders * 0.28),
      revenue: Math.round(baseRevenue * 0.34),
      conversionRate: 4.8,
    },
    {
      name: "ErgoMesh Office Chair",
      orders: Math.round(baseOrders * 0.24),
      revenue: Math.round(baseRevenue * 0.26),
      conversionRate: 5.2,
    },
    {
      name: "FocusLite Monitor Arm",
      orders: Math.round(baseOrders * 0.18),
      revenue: Math.round(baseRevenue * 0.14),
      conversionRate: 3.7,
    },
    {
      name: "AmbientPro LED Strip",
      orders: Math.round(baseOrders * 0.16),
      revenue: Math.round(baseRevenue * 0.12),
      conversionRate: 4.1,
    },
  ];

  return products;
}

function buildRecentActivity(users: DashboardUser[]): RecentActivity[] {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return users
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 6)
    .map((user, index) => ({
      title: `${user.firstName ?? "User"} ${user.lastName ?? ""}`.trim() || user.email,
      description: `Account ${index % 2 === 0 ? "activity" : "profile update"} recorded`,
      timestamp: formatter.format(parseISO(user.updatedAt)),
      status: index % 3 === 0 ? "success" : index % 3 === 1 ? "warning" : "info",
    }));
}

function buildTeamFocus(userStats: UserStats): TeamFocus[] {
  const opsCapacity = Math.min(100, Math.round((userStats.managerUsers / Math.max(userStats.totalUsers, 1)) * 180));
  const supportCapacity = Math.min(100, Math.round((userStats.customerUsers / Math.max(userStats.totalUsers, 1)) * 120));
  const automation = Math.max(55, Math.round((userStats.adminUsers / Math.max(userStats.totalUsers, 1)) * 220));

  return [
    {
      name: "Operations",
      role: "Fulfilment SLAs",
      avatarFallback: "OP",
      metric: `${opsCapacity}% on-time shipping`,
      trend: 6.4,
    },
    {
      name: "Support",
      role: "Customer Happiness",
      avatarFallback: "CS",
      metric: `${supportCapacity}% first-contact resolution`,
      trend: 4.1,
    },
    {
      name: "Automation",
      role: "Catalog Health",
      avatarFallback: "AI",
      metric: `${automation}% listings synced`,
      trend: 3.2,
    },
  ];
}

function percentageChange(previous: number, current: number): number {
  if (!previous) return current ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

function getMockDashboardData(): DashboardData {
  const mockUsers: DashboardUser[] = [
    {
      id: "1",
      email: "olivia@atlasops.io",
      firstName: "Olivia",
      lastName: "Rhodes",
      fullName: "Olivia Rhodes",
      role: "admin",
      isActive: true,
      createdAt: new Date("2023-04-18T10:23:00Z").toISOString(),
      updatedAt: new Date("2024-11-12T09:24:00Z").toISOString(),
    },
    {
      id: "2",
      email: "miles@atlasops.io",
      firstName: "Miles",
      lastName: "Chen",
      fullName: "Miles Chen",
      role: "manager",
      isActive: true,
      createdAt: new Date("2023-09-09T12:45:00Z").toISOString(),
      updatedAt: new Date("2024-11-12T08:11:00Z").toISOString(),
    },
    {
      id: "3",
      email: "sara@atlasops.io",
      firstName: "Sara",
      lastName: "Amari",
      fullName: "Sara Amari",
      role: "manager",
      isActive: true,
      createdAt: new Date("2024-01-16T08:20:00Z").toISOString(),
      updatedAt: new Date("2024-11-11T21:46:00Z").toISOString(),
    },
    {
      id: "4",
      email: "diego@atlasops.io",
      firstName: "Diego",
      lastName: "Prieto",
      fullName: "Diego Prieto",
      role: "manager",
      isActive: true,
      createdAt: new Date("2024-02-02T15:55:00Z").toISOString(),
      updatedAt: new Date("2024-11-11T18:05:00Z").toISOString(),
    },
    {
      id: "5",
      email: "maya@atlasops.io",
      firstName: "Maya",
      lastName: "Harrison",
      fullName: "Maya Harrison",
      role: "customer",
      isActive: true,
      createdAt: new Date("2024-09-28T11:12:00Z").toISOString(),
      updatedAt: new Date("2024-11-11T16:37:00Z").toISOString(),
    },
    {
      id: "6",
      email: "alec@atlasops.io",
      firstName: "Alec",
      lastName: "Moreno",
      fullName: "Alec Moreno",
      role: "customer",
      isActive: true,
      createdAt: new Date("2024-10-06T07:32:00Z").toISOString(),
      updatedAt: new Date("2024-11-11T12:14:00Z").toISOString(),
    },
    {
      id: "7",
      email: "nina@atlasops.io",
      firstName: "Nina",
      lastName: "Vega",
      fullName: "Nina Vega",
      role: "customer",
      isActive: false,
      createdAt: new Date("2024-07-14T09:44:00Z").toISOString(),
      updatedAt: new Date("2024-11-08T19:33:00Z").toISOString(),
    },
    {
      id: "8",
      email: "ren@atlasops.io",
      firstName: "Ren",
      lastName: "Ayodele",
      fullName: "Ren Ayodele",
      role: "customer",
      isActive: true,
      createdAt: new Date("2024-10-21T17:21:00Z").toISOString(),
      updatedAt: new Date("2024-11-10T14:48:00Z").toISOString(),
    },
  ];

  const userStats = computeUserStats(mockUsers);

  return {
    summary: {
      revenue: 48200,
      revenueChange: 12.4,
      orders: 612,
      ordersChange: 8.1,
      averageOrderValue: 79,
      averageOrderValueChange: 3.7,
      retentionRate: 87.5,
      retentionRateChange: 2.1,
    },
    userStats,
    monthlyPerformance: [
      { month: "Jun", revenue: 31200, orders: 402, profitMargin: 51.2, newUsers: 72 },
      { month: "Jul", revenue: 33800, orders: 428, profitMargin: 53.7, newUsers: 81 },
      { month: "Aug", revenue: 36100, orders: 447, profitMargin: 55.4, newUsers: 86 },
      { month: "Sep", revenue: 38900, orders: 468, profitMargin: 57.9, newUsers: 95 },
      { month: "Oct", revenue: 42100, orders: 496, profitMargin: 60.4, newUsers: 104 },
      { month: "Nov", revenue: 48200, orders: 612, profitMargin: 64.1, newUsers: 120 },
    ],
    channelPerformance: [
      { channel: "Direct Store", revenue: 20250, percentage: 42.0 },
      { channel: "Marketplaces", revenue: 15800, percentage: 32.8 },
      { channel: "Affiliate Partners", revenue: 7800, percentage: 16.2 },
      { channel: "Paid Social", revenue: 4350, percentage: 9.0 },
    ],
    topProducts: [
      { name: "EcoFlex Standing Desk", orders: 174, revenue: 16400, conversionRate: 4.8 },
      { name: "ErgoMesh Office Chair", orders: 148, revenue: 13400, conversionRate: 5.2 },
      { name: "FocusLite Monitor Arm", orders: 112, revenue: 9100, conversionRate: 3.7 },
      { name: "AmbientPro LED Strip", orders: 98, revenue: 7600, conversionRate: 4.1 },
    ],
    recentActivities: buildRecentActivity(mockUsers),
    teamFocus: buildTeamFocus(userStats),
    users: mockUsers,
  } satisfies DashboardData;
}

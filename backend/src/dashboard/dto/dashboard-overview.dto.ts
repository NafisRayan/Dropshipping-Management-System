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
  status: 'success' | 'warning' | 'info';
};

export type TeamFocus = {
  name: string;
  role: string;
  avatarFallback: string;
  metric: string;
  trend: number;
};

export type DashboardUser = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  fullName: string;
};

export type DashboardOverview = {
  summary: DashboardSummary;
  userStats: UserStats;
  monthlyPerformance: MonthlyPerformancePoint[];
  channelPerformance: ChannelPerformance[];
  topProducts: TopProduct[];
  recentActivities: RecentActivity[];
  teamFocus: TeamFocus[];
  users: DashboardUser[];
};

export interface DashboardMetrics {
  totalOrders: number
  totalProducts: number
  totalCustomers: number
  totalUsers: number
  totalRevenue: number
  recentOrders: Order[]
  ordersByStatus: Array<{
    status: string
    count: number
  }>
}

export interface RevenueData {
  date: string
  revenue: number
}

export interface ProductAnalytics {
  topProducts: Array<{
    productId: string
    totalSold: number
    totalRevenue: number
  }>
  lowStockProducts: Product[]
}

export interface CustomerAnalytics {
  topCustomers: Array<{
    customerId: string
    orderCount: number
    totalSpent: number
  }>
  newCustomers: number
}
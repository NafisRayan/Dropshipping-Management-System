'use client'

import { useQuery } from 'react-query'
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  DollarSign,
  BarChart3,
  Calendar
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { analyticsApi } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AnalyticsPage() {
  const { data: dashboardMetrics, isLoading: dashboardLoading } = useQuery(
    'dashboard-metrics',
    analyticsApi.getDashboardMetrics
  )

  const { data: productAnalytics, isLoading: productsLoading } = useQuery(
    'product-analytics',
    analyticsApi.getProductAnalytics
  )

  const { data: customerAnalytics, isLoading: customersLoading } = useQuery(
    'customer-analytics',
    analyticsApi.getCustomerAnalytics
  )

  const isLoading = dashboardLoading || productsLoading || customersLoading

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  const topProducts = productAnalytics?.data?.topProducts || []
  const topCustomers = customerAnalytics?.data?.topCustomers || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive insights into your business performance
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">Last 30 days</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dashboardMetrics?.data?.totalRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardMetrics?.data?.totalOrders || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +15.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customerAnalytics?.data?.newCustomers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                dashboardMetrics?.data?.totalRevenue && dashboardMetrics?.data?.totalOrders
                  ? dashboardMetrics.data.totalRevenue / dashboardMetrics.data.totalOrders
                  : 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              +5.7% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="productId" 
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                  />
                  <Bar 
                    dataKey="totalRevenue" 
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
          <CardDescription>Customers by total spending</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-sm font-medium text-gray-900">
                    Customer
                  </th>
                  <th className="text-left py-2 text-sm font-medium text-gray-900">
                    Orders
                  </th>
                  <th className="text-left py-2 text-sm font-medium text-gray-900">
                    Total Spent
                  </th>
                  <th className="text-left py-2 text-sm font-medium text-gray-900">
                    Avg Order Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.slice(0, 10).map((customer: any) => (
                  <tr key={customer.customerId} className="border-b">
                    <td className="py-3 text-sm">
                      Customer {customer.customerId.substring(0, 8)}
                    </td>
                    <td className="py-3 text-sm">
                      {customer.orderCount} orders
                    </td>
                    <td className="py-3 text-sm font-medium">
                      {formatCurrency(customer.totalSpent)}
                    </td>
                    <td className="py-3 text-sm">
                      {formatCurrency(customer.totalSpent / customer.orderCount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
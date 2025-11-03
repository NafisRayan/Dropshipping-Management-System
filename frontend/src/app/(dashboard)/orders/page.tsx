'use client'

import { useState } from 'react'
import { useQuery } from 'react-query'
import { Plus, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { OrderList } from '@/components/orders/order-list'
import { ordersApi } from '@/lib/api'
import Link from 'next/link'

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const { data: orders, isLoading, refetch } = useQuery(
    ['orders', searchTerm, statusFilter],
    () => ordersApi.getAll(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  // Filter orders based on search and status
  const filteredOrders = orders?.data?.filter((order: any) => {
    const matchesSearch = !searchTerm || 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  }) || []

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">
            Manage customer orders ({filteredOrders.length} total)
          </p>
        </div>
        <Link href="/orders/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('')
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Pending', value: filteredOrders.filter(o => o.status === 'pending').length, color: 'bg-yellow-50 text-yellow-800' },
          { title: 'Processing', value: filteredOrders.filter(o => o.status === 'processing').length, color: 'bg-blue-50 text-blue-800' },
          { title: 'Shipped', value: filteredOrders.filter(o => o.status === 'shipped').length, color: 'bg-purple-50 text-purple-800' },
          { title: 'Delivered', value: filteredOrders.filter(o => o.status === 'delivered').length, color: 'bg-green-50 text-green-800' },
        ].map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className={cn('text-2xl font-bold', stat.color)}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {stat.title} Orders
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order List */}
      <OrderList 
        orders={filteredOrders} 
        isLoading={isLoading}
        onRefresh={refetch}
      />
    </div>
  )
}
'use client'

import { useState } from 'react'
import { 
  ShoppingCart, 
  Eye, 
  Edit, 
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import Link from 'next/link'
import type { Order } from '@/types/order'

interface OrderListProps {
  orders: Order[]
  isLoading: boolean
  onRefresh: () => void
}

export function OrderList({ orders, isLoading, onRefresh }: OrderListProps) {
  const getStatusIcon = (status: string) => {
    const icons = {
      pending: Clock,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: XCircle,
      refunded: XCircle,
    }
    return icons[status as keyof typeof icons] || Clock
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-pulse space-y-4 w-full">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="bg-gray-200 rounded h-12 w-12" />
                <div className="flex-1 space-y-2">
                  <div className="bg-gray-200 rounded h-4 w-3/4" />
                  <div className="bg-gray-200 rounded h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>Manage and track customer orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => {
            const StatusIcon = getStatusIcon(order.status)
            return (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Order #{order.orderNumber}
                      </h3>
                      <Badge className={getStatusColor(order.status)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Customer:</span>
                        <p className="font-medium">
                          {order.customer?.firstName} {order.customer?.lastName}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-gray-500">Total:</span>
                        <p className="font-medium">{formatCurrency(order.totalAmount)}</p>
                      </div>
                      
                      <div>
                        <span className="text-gray-500">Items:</span>
                        <p className="font-medium">{order.itemCount || 0} items</p>
                      </div>
                      
                      <div>
                        <span className="text-gray-500">Date:</span>
                        <p className="font-medium">{formatDateTime(order.createdAt)}</p>
                      </div>
                    </div>
                    
                    {order.trackingNumber && (
                      <div className="mt-2 text-sm">
                        <span className="text-gray-500">Tracking:</span>
                        <span className="font-medium ml-2">{order.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Link href={`/orders/${order.id}`}>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    
                    {order.status === 'pending' && (
                      <Link href={`/orders/${order.id}/edit`}>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
                
                {/* Order Items Preview */}
                {order.items && order.items.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Items:</p>
                    <div className="space-y-1">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.productName} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            {formatCurrency(item.totalPrice)}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-sm text-gray-500 italic">
                          +{order.items.length - 3} more items
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        {orders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">
              No orders match your current filters
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
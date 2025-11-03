import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Eye } from 'lucide-react'
import Link from 'next/link'
import type { Order } from '@/types/order'

interface RecentOrdersProps {
  orders: Order[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest orders from your store</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Order #{order.orderNumber}</p>
                  <span className={cn(
                    'px-2 py-1 text-xs font-medium rounded-full',
                    getStatusColor(order.status)
                  )}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{order.customer?.firstName} {order.customer?.lastName}</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDateTime(order.createdAt)}
                </p>
              </div>
              <Link href={`/orders/${order.id}`}>
                <Button size="sm" variant="ghost" className="ml-4">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
        
        {orders.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No recent orders found
          </p>
        )}
      </CardContent>
    </Card>
  )
}
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ordersAPI } from '@/lib/api';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await ordersAPI.updateStatus(orderId, status);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">
          Track and manage customer orders
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order: any) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                  <CardDescription>
                    Customer: {order.user?.firstName} {order.user?.lastName}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status as keyof typeof statusColors]}`}>
                    {order.status.toUpperCase()}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Total Amount: ${order.totalAmount}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                {order.shippingAddress && (
                  <div>
                    <p className="text-sm font-medium">Shipping Address:</p>
                    <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
                  </div>
                )}

                {order.trackingNumber && (
                  <div>
                    <p className="text-sm font-medium">Tracking Number:</p>
                    <p className="text-sm text-muted-foreground">{order.trackingNumber}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium mb-2">Order Items:</p>
                  <div className="space-y-2">
                    {order.orderItems?.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.product?.name} (x{item.quantity})</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.notes && (
                  <div>
                    <p className="text-sm font-medium">Notes:</p>
                    <p className="text-sm text-muted-foreground">{order.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No orders found</p>
            <p className="text-sm text-muted-foreground">Orders will appear here when customers place them</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import api from "@/lib/api"

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: { name: string };
  variant?: { name: string; value: string };
}

interface Order {
  id: number;
  customer: { name: string; email: string };
  status: string;
  totalAmount: number;
  trackingNumber?: string;
  supplierOrderId?: string;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending': return 'secondary';
    case 'processing': return 'default';
    case 'shipped': return 'outline';
    case 'delivered': return 'default';
    case 'cancelled': return 'destructive';
    default: return 'secondary';
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    api.get('/orders')
      .then(response => setOrders(response.data))
      .catch(error => console.error('Error fetching orders:', error));
  }, []);

  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Button>Add Order</Button>
      </div>

      <div className="space-y-4">
        {orders.map(o => (
          <Card key={o.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Order #{o.id}</span>
                <div className="flex gap-2 items-center">
                  <Badge variant={getStatusColor(o.status)}>
                    {o.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleOrderDetails(o.id)}
                  >
                    {expandedOrder === o.id ? 'Hide' : 'Show'} Details
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <strong>Customer:</strong> {o.customer.name}
                </div>
                <div>
                  <strong>Email:</strong> {o.customer.email}
                </div>
                <div>
                  <strong>Total:</strong> ${o.totalAmount}
                </div>
                <div>
                  <strong>Items:</strong> {o.orderItems.length}
                </div>
                <div>
                  <strong>Tracking:</strong> {o.trackingNumber || 'N/A'}
                </div>
                <div>
                  <strong>Supplier Order:</strong> {o.supplierOrderId || 'N/A'}
                </div>
                <div>
                  <strong>Created:</strong> {new Date(o.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <strong>Updated:</strong> {new Date(o.updatedAt).toLocaleDateString()}
                </div>
              </div>

              {expandedOrder === o.id && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Order Items:</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Variant</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {o.orderItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.product.name}</TableCell>
                          <TableCell>
                            {item.variant ? `${item.variant.name}: ${item.variant.value}` : 'N/A'}
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.price}</TableCell>
                          <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
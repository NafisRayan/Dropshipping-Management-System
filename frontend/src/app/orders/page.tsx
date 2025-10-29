'use client';

import { useEffect, useState } from 'react';
import api, { setAuthToken } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Order = {
  id: number;
  customerId: string;
  productId: number;
  quantity: number;
  status: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setAuthToken(token || undefined);
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load orders');
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="grid grid-cols-1 gap-4">
        {orders.map((o) => (
          <Card key={o.id}>
            <CardHeader>
              <CardTitle>Order #{o.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Customer: {o.customerId}</p>
              <p>Product ID: {o.productId}</p>
              <p>Quantity: {o.quantity}</p>
              <p>Status: {o.status}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

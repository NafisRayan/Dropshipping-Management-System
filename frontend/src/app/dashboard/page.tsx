'use client';

import { useEffect, useState } from 'react';
import api, { setAuthToken } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const [stats, setStats] = useState({ products: 0, orders: 0 });

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setAuthToken(token || undefined);
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        api.get('/products'),
        api.get('/orders'),
      ]);
      setStats({
        products: productsRes.data.length,
        orders: ordersRes.data.length,
      });
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-6">Welcome to the Dropshipping Management System</p>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.products}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.orders}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
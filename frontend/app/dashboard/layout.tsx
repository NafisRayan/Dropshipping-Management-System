'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ConnectionStatus from '@/components/connection-status';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }
    
    setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ConnectionStatus />
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Dropshipping Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user.firstName} {user.lastName}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex">
          <aside className="w-64 bg-white rounded-lg shadow-sm mr-6 p-4">
            <nav className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => router.push('/dashboard')}
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => router.push('/dashboard/products')}
              >
                Products
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => router.push('/dashboard/orders')}
              >
                Orders
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => router.push('/dashboard/suppliers')}
              >
                Suppliers
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => router.push('/dashboard/customers')}
              >
                Customers
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => router.push('/dashboard/reports')}
              >
                Reports
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => router.push('/dashboard/notifications')}
              >
                Notifications
              </Button>
            </nav>
          </aside>
          
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function NavBar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/products" className="hover:underline">Products</Link>
          <Link href="/orders" className="hover:underline">Orders</Link>
        </div>
        <Button onClick={handleLogout} variant="outline">Logout</Button>
      </div>
    </nav>
  );
}
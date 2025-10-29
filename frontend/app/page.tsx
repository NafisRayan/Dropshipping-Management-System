'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      router.push('/dashboard');
    }
  }, [router]);

  if (isAuthenticated) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Dropshipping Management</CardTitle>
          <CardDescription>
            Manage your dropshipping business efficiently
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Demo Credentials Info */}
          <div className="p-3 bg-green-50 border border-green-200 rounded-md text-center">
            <div className="text-sm font-medium text-green-800 mb-1">Try the Demo</div>
            <div className="text-xs text-green-600">
              <div>Email: demo@example.com</div>
              <div>Password: demo123</div>
            </div>
          </div>

          <Button 
            className="w-full" 
            onClick={() => router.push('/auth/login')}
          >
            Login
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => router.push('/auth/register')}
          >
            Register
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
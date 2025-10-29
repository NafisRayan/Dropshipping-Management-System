'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import api from "@/lib/api"

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate?: string;
  createdAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    api.get('/customers')
      .then(response => setCustomers(response.data))
      .catch(error => console.error('Error fetching customers:', error));
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Button>Add Customer</Button>
      </div>

      <div className="space-y-4">
        {customers.map(c => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{c.name}</span>
                <Badge variant="outline">
                  {c.ordersCount} orders
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <strong>Email:</strong> {c.email}
                </div>
                <div>
                  <strong>Phone:</strong> {c.phone || 'N/A'}
                </div>
                <div>
                  <strong>Total Spent:</strong> ${c.totalSpent}
                </div>
                <div>
                  <strong>Address:</strong> {c.address || 'N/A'}
                </div>
                <div>
                  <strong>Last Order:</strong> {c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString() : 'Never'}
                </div>
                <div>
                  <strong>Joined:</strong> {new Date(c.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
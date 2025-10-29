'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import api from "@/lib/api"

interface Supplier {
  id: number;
  name: string;
  contact: string;
  email: string;
  apiUrl?: string;
  apiKey?: string;
  apiSecret?: string;
  products: { name: string }[];
  lastSync?: string;
  syncStatus: string;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [syncing, setSyncing] = useState<number | null>(null);

  useEffect(() => {
    api.get('/suppliers')
      .then(response => setSuppliers(response.data))
      .catch(error => console.error('Error fetching suppliers:', error));
  }, []);

  const handleSync = async (supplierId: number) => {
    setSyncing(supplierId);
    try {
      await api.post(`/suppliers/${supplierId}/sync`);
      // Refresh suppliers data
      const response = await api.get('/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(null);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Suppliers</h1>
        <Button>Add Supplier</Button>
      </div>

      <div className="space-y-4">
        {suppliers.map(s => (
          <Card key={s.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{s.name}</span>
                <div className="flex gap-2 items-center">
                  <Badge variant={s.syncStatus === 'success' ? 'default' : s.syncStatus === 'failed' ? 'destructive' : 'secondary'}>
                    {s.syncStatus}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSync(s.id)}
                    disabled={syncing === s.id}
                  >
                    {syncing === s.id ? 'Syncing...' : 'Sync Products'}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <strong>Contact:</strong> {s.contact}
                </div>
                <div>
                  <strong>Email:</strong> {s.email}
                </div>
                <div>
                  <strong>Products:</strong> {s.products.length}
                </div>
                <div>
                  <strong>API URL:</strong> {s.apiUrl || 'Not configured'}
                </div>
                <div>
                  <strong>API Key:</strong> {s.apiKey ? '••••••••' : 'Not configured'}
                </div>
                <div>
                  <strong>Last Sync:</strong> {s.lastSync ? new Date(s.lastSync).toLocaleString() : 'Never'}
                </div>
              </div>

              {s.apiSecret && (
                <div className="mt-2">
                  <strong>API Secret:</strong> ••••••••
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
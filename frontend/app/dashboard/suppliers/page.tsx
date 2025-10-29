'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { suppliersAPI } from '@/lib/api';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    notes: '',
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await suppliersAPI.getAll();
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await suppliersAPI.create(formData);
      setShowForm(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        website: '',
        notes: '',
      });
      fetchSuppliers();
    } catch (error) {
      console.error('Error creating supplier:', error);
    }
  };

  if (loading) {
    return <div>Loading suppliers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Suppliers</h2>
          <p className="text-muted-foreground">
            Manage your supplier relationships
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Supplier'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Supplier</CardTitle>
            <CardDescription>
              Enter supplier information to add to your network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Supplier Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <Button type="submit">Add Supplier</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((supplier: any) => (
          <Card key={supplier.id}>
            <CardHeader>
              <CardTitle className="text-lg">{supplier.name}</CardTitle>
              <CardDescription>{supplier.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {supplier.phone && (
                  <p className="text-sm">Phone: {supplier.phone}</p>
                )}
                {supplier.website && (
                  <p className="text-sm">Website: {supplier.website}</p>
                )}
                {supplier.address && (
                  <p className="text-sm">Address: {supplier.address}</p>
                )}
                {supplier.notes && (
                  <p className="text-sm text-muted-foreground">Notes: {supplier.notes}</p>
                )}
                <div className="text-sm text-muted-foreground">
                  Products: {supplier.products?.length || 0}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {suppliers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No suppliers found</p>
            <Button onClick={() => setShowForm(true)}>Add your first supplier</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { customersAPI } from '@/lib/api';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    notes: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customersAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await customersAPI.create(formData);
      setShowForm(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        notes: '',
      });
      fetchCustomers();
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  const viewCustomerDetails = async (customerId: number) => {
    try {
      const response = await customersAPI.getStats(customerId);
      setSelectedCustomer(response.data);
    } catch (error) {
      console.error('Error fetching customer details:', error);
    }
  };

  if (loading) {
    return <div>Loading customers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">
            Manage your customer relationships
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Customer'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Customer</CardTitle>
            <CardDescription>
              Enter customer information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <Button type="submit">Add Customer</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customers.map((customer: any) => (
          <Card key={customer.id} className="cursor-pointer hover:shadow-md" onClick={() => viewCustomerDetails(customer.id)}>
            <CardHeader>
              <CardTitle className="text-lg">{customer.firstName} {customer.lastName}</CardTitle>
              <CardDescription>{customer.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {customer.phone && (
                  <p className="text-sm">Phone: {customer.phone}</p>
                )}
                {customer.address && (
                  <p className="text-sm">Address: {customer.address}</p>
                )}
                <div className="text-sm text-muted-foreground">
                  Orders: {customer.orders?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Joined: {new Date(customer.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCustomer && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
            <Button 
              variant="outline" 
              onClick={() => setSelectedCustomer(null)}
              className="ml-auto"
            >
              Close
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Customer Information</h4>
                <p><strong>Name:</strong> {selectedCustomer.customer.firstName} {selectedCustomer.customer.lastName}</p>
                <p><strong>Email:</strong> {selectedCustomer.customer.email}</p>
                <p><strong>Phone:</strong> {selectedCustomer.customer.phone || 'N/A'}</p>
                <p><strong>Address:</strong> {selectedCustomer.customer.address || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Statistics</h4>
                <p><strong>Total Orders:</strong> {selectedCustomer.stats.totalOrders}</p>
                <p><strong>Total Spent:</strong> ${selectedCustomer.stats.totalSpent.toFixed(2)}</p>
                <p><strong>Average Order:</strong> ${selectedCustomer.stats.averageOrderValue.toFixed(2)}</p>
                <p><strong>Last Order:</strong> {selectedCustomer.stats.lastOrderDate ? new Date(selectedCustomer.stats.lastOrderDate).toLocaleDateString() : 'Never'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {customers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No customers found</p>
            <Button onClick={() => setShowForm(true)}>Add your first customer</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
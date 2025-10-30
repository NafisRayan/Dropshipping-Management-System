'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { reportsAPI } from '@/lib/api';

export default function ReportsPage() {
  const [salesReport, setSalesReport] = useState<any>(null);
  const [inventoryReport, setInventoryReport] = useState<any>(null);
  const [supplierReport, setSupplierReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const [salesRes, inventoryRes, supplierRes] = await Promise.all([
        reportsAPI.getSales(dateRange.startDate, dateRange.endDate),
        reportsAPI.getInventory(),
        reportsAPI.getSuppliers(),
      ]);

      setSalesReport(salesRes.data);
      setInventoryReport(inventoryRes.data);
      setSupplierReport(supplierRes.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = () => {
    setLoading(true);
    fetchReports();
  };

  if (loading) {
    return <div>Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
        <p className="text-muted-foreground">
          Comprehensive business insights and performance metrics
        </p>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Date Range</CardTitle>
          <CardDescription>Select date range for sales reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end space-x-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
            <Button onClick={handleDateRangeChange}>Update Reports</Button>
          </div>
        </CardContent>
      </Card>

      {/* Sales Report */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Report</CardTitle>
          <CardDescription>Sales performance for selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${salesReport?.totalSales?.toFixed(2) || '0.00'}
              </div>
              <div className="text-sm text-muted-foreground">Total Sales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {salesReport?.totalOrders || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ${salesReport?.averageOrderValue?.toFixed(2) || '0.00'}
              </div>
              <div className="text-sm text-muted-foreground">Average Order Value</div>
            </div>
          </div>

          {salesReport?.salesByDate && salesReport.salesByDate.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Daily Sales Breakdown</h4>
              <div className="space-y-2">
                {salesReport.salesByDate.map((day: any) => (
                  <div key={day.date} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>{new Date(day.date).toLocaleDateString()}</span>
                    <div className="text-right">
                      <div className="font-medium">${day.sales.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">{day.orders} orders</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inventory Report */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Report</CardTitle>
          <CardDescription>Current inventory status and valuation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {inventoryReport?.totalProducts || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {inventoryReport?.lowStockProducts || 0}
              </div>
              <div className="text-sm text-muted-foreground">Low Stock</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {inventoryReport?.outOfStockProducts || 0}
              </div>
              <div className="text-sm text-muted-foreground">Out of Stock</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${inventoryReport?.totalInventoryValue?.toFixed(2) || '0.00'}
              </div>
              <div className="text-sm text-muted-foreground">Inventory Value</div>
            </div>
          </div>

          {inventoryReport?.products && inventoryReport.products.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Product Inventory Details</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Product</th>
                      <th className="text-left p-2">SKU</th>
                      <th className="text-right p-2">Stock</th>
                      <th className="text-right p-2">Threshold</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-right p-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryReport.products.slice(0, 10).map((product: any) => (
                      <tr key={product.id} className="border-b">
                        <td className="p-2">{product.name}</td>
                        <td className="p-2">{product.sku}</td>
                        <td className="p-2 text-right">{product.stock}</td>
                        <td className="p-2 text-right">{product.lowStockThreshold}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            product.isLowStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {product.isLowStock ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>
                        <td className="p-2 text-right">${product.value.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Supplier Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Performance</CardTitle>
          <CardDescription>Performance metrics for all suppliers</CardDescription>
        </CardHeader>
        <CardContent>
          {supplierReport && supplierReport.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Supplier</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-right p-2">Products</th>
                    <th className="text-right p-2">Total Sales</th>
                    <th className="text-right p-2">Delivered Orders</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierReport.map((supplier: any) => (
                    <tr key={supplier.id} className="border-b">
                      <td className="p-2 font-medium">{supplier.name}</td>
                      <td className="p-2">{supplier.email}</td>
                      <td className="p-2 text-right">{supplier.totalProducts}</td>
                      <td className="p-2 text-right">${supplier.totalSales.toFixed(2)}</td>
                      <td className="p-2 text-right">{supplier.deliveredOrders}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          supplier.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {supplier.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">No supplier data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
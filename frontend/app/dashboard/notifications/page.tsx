'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { notificationsAPI } from '@/lib/api';

export default function NotificationsPage() {
  const [alerts, setAlerts] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await notificationsAPI.getAlerts();
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendLowStockEmail = async (productName: string, currentStock: number, threshold: number) => {
    try {
      await notificationsAPI.sendLowStockEmail({
        productName,
        currentStock,
        threshold,
      });
      alert('Low stock email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    }
  };

  const sendOrderConfirmation = async (orderNumber: string, customerEmail: string) => {
    try {
      await notificationsAPI.sendOrderConfirmation({
        orderNumber,
        customerEmail,
      });
      alert('Order confirmation email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    }
  };

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Notifications & Alerts</h2>
        <p className="text-muted-foreground">
          System alerts and notification management
        </p>
      </div>

      {/* Alert Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {alerts?.totalAlerts || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Active system alerts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {alerts?.lowStockAlerts?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Products need restocking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {alerts?.pendingOrderAlerts?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Orders awaiting processing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Alerts</CardTitle>
          <CardDescription>Products that need immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          {alerts?.lowStockAlerts && alerts.lowStockAlerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.lowStockAlerts.map((alert: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 border border-orange-200 bg-orange-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-orange-600 font-medium">⚠️ Low Stock Alert</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      <span>SKU: {alert.sku}</span>
                      <span className="mx-2">•</span>
                      <span>Current Stock: {alert.currentStock}</span>
                      <span className="mx-2">•</span>
                      <span>Threshold: {alert.threshold}</span>
                      {alert.supplier && (
                        <>
                          <span className="mx-2">•</span>
                          <span>Supplier: {alert.supplier}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => sendLowStockEmail(alert.productName, alert.currentStock, alert.threshold)}
                    >
                      Send Email Alert
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-green-600 text-4xl mb-2">✅</div>
              <p className="text-muted-foreground">No low stock alerts</p>
              <p className="text-sm text-muted-foreground">All products are adequately stocked</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Order Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Order Alerts</CardTitle>
          <CardDescription>Orders that require processing</CardDescription>
        </CardHeader>
        <CardContent>
          {alerts?.pendingOrderAlerts && alerts.pendingOrderAlerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.pendingOrderAlerts.map((alert: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600 font-medium">📦 Pending Order</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      <span>Customer: {alert.customerName}</span>
                      <span className="mx-2">•</span>
                      <span>Amount: ${alert.totalAmount}</span>
                      <span className="mx-2">•</span>
                      <span>Date: {new Date(alert.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`/dashboard/orders`, '_blank')}
                    >
                      View Order
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => sendOrderConfirmation(alert.orderNumber, 'customer@example.com')}
                    >
                      Send Confirmation
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-green-600 text-4xl mb-2">✅</div>
              <p className="text-muted-foreground">No pending orders</p>
              <p className="text-sm text-muted-foreground">All orders are being processed</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Email Notification Settings</CardTitle>
          <CardDescription>Configure automatic email notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Low Stock Alerts</div>
                <div className="text-sm text-muted-foreground">
                  Automatically send email when products are low on stock
                </div>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Order Confirmations</div>
                <div className="text-sm text-muted-foreground">
                  Send confirmation emails to customers when orders are placed
                </div>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Shipping Notifications</div>
                <div className="text-sm text-muted-foreground">
                  Notify customers when their orders are shipped
                </div>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button onClick={fetchAlerts} variant="outline">
          Refresh Alerts
        </Button>
      </div>
    </div>
  );
}
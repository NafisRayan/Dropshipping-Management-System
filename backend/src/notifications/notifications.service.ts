import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/product.entity';
import { Order, OrderStatus } from '../orders/order.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async checkLowStockAlerts() {
    const lowStockProducts = await this.productsRepository.find({
      where: { isActive: true },
      relations: ['supplier'],
    });

    const alerts = lowStockProducts
      .filter(product => product.stock <= product.lowStockThreshold)
      .map(product => ({
        type: 'LOW_STOCK',
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        currentStock: product.stock,
        threshold: product.lowStockThreshold,
        supplier: product.supplier?.name,
        message: `Product "${product.name}" is running low on stock (${product.stock} remaining)`,
      }));

    // Update isLowStock flag
    for (const product of lowStockProducts) {
      const isLowStock = product.stock <= product.lowStockThreshold;
      if (product.isLowStock !== isLowStock) {
        await this.productsRepository.update(product.id, { isLowStock });
      }
    }

    return alerts;
  }

  async getPendingOrderAlerts() {
    const pendingOrders = await this.ordersRepository.find({
      where: { status: OrderStatus.PENDING },
      relations: ['customer', 'orderItems'],
      order: { createdAt: 'ASC' },
    });

    return pendingOrders.map(order => ({
      type: 'PENDING_ORDER',
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'Guest',
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      message: `Order #${order.orderNumber} is pending processing`,
    }));
  }

  async sendLowStockEmail(productName: string, currentStock: number, threshold: number) {
    // In a real implementation, you would integrate with an email service like SendGrid, AWS SES, etc.
    console.log(`LOW STOCK ALERT: ${productName} has ${currentStock} items remaining (threshold: ${threshold})`);
    
    // Mock email sending
    return {
      success: true,
      message: `Low stock alert sent for ${productName}`,
    };
  }

  async sendOrderConfirmationEmail(orderNumber: string, customerEmail: string) {
    // Mock email sending
    console.log(`ORDER CONFIRMATION: Sent to ${customerEmail} for order #${orderNumber}`);
    
    return {
      success: true,
      message: `Order confirmation sent to ${customerEmail}`,
    };
  }

  async sendShippingNotificationEmail(orderNumber: string, trackingNumber: string, customerEmail: string) {
    // Mock email sending
    console.log(`SHIPPING NOTIFICATION: Order #${orderNumber} shipped with tracking ${trackingNumber} - sent to ${customerEmail}`);
    
    return {
      success: true,
      message: `Shipping notification sent to ${customerEmail}`,
    };
  }

  async getAllAlerts() {
    const [lowStockAlerts, pendingOrderAlerts] = await Promise.all([
      this.checkLowStockAlerts(),
      this.getPendingOrderAlerts(),
    ]);

    return [...lowStockAlerts, ...pendingOrderAlerts];
  }
}
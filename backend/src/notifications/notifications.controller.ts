import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('alerts')
  @ApiOperation({ summary: 'Get all system alerts' })
  getAllAlerts() {
    return this.notificationsService.getAllAlerts();
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get low stock alerts' })
  getLowStockAlerts() {
    return this.notificationsService.checkLowStockAlerts();
  }

  @Get('pending-orders')
  @ApiOperation({ summary: 'Get pending order alerts' })
  getPendingOrderAlerts() {
    return this.notificationsService.getPendingOrderAlerts();
  }

  @Post('send-low-stock-email')
  @ApiOperation({ summary: 'Send low stock email alert' })
  sendLowStockEmail(@Body() body: { productName: string; currentStock: number; threshold: number }) {
    return this.notificationsService.sendLowStockEmail(body.productName, body.currentStock, body.threshold);
  }

  @Post('send-order-confirmation')
  @ApiOperation({ summary: 'Send order confirmation email' })
  sendOrderConfirmation(@Body() body: { orderNumber: string; customerEmail: string }) {
    return this.notificationsService.sendOrderConfirmationEmail(body.orderNumber, body.customerEmail);
  }

  @Post('send-shipping-notification')
  @ApiOperation({ summary: 'Send shipping notification email' })
  sendShippingNotification(@Body() body: { orderNumber: string; trackingNumber: string; customerEmail: string }) {
    return this.notificationsService.sendShippingNotificationEmail(body.orderNumber, body.trackingNumber, body.customerEmail);
  }
}
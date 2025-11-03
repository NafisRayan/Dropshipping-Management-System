import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('mail.host'),
      port: this.configService.get('mail.port'),
      secure: this.configService.get('mail.secure'),
      auth: {
        user: this.configService.get('mail.user'),
        pass: this.configService.get('mail.password'),
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    template: string,
    context: any,
  ): Promise<void> {
    const templatePath = path.join(__dirname, 'templates', `${template}.hbs`);
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(templateSource);
    const html = compiledTemplate(context);

    const mailOptions = {
      from: this.configService.get('mail.from'),
      to,
      subject,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendOrderConfirmation(customerEmail: string, orderData: any): Promise<void> {
    await this.sendEmail(
      customerEmail,
      'Order Confirmation',
      'order-confirmation',
      orderData,
    );
  }

  async sendOrderStatusUpdate(customerEmail: string, orderData: any): Promise<void> {
    await this.sendEmail(
      customerEmail,
      'Order Status Update',
      'order-status-update',
      orderData,
    );
  }

  async sendLowStockAlert(adminEmail: string, productData: any): Promise<void> {
    await this.sendEmail(
      adminEmail,
      'Low Stock Alert',
      'low-stock-alert',
      productData,
    );
  }

  async sendWelcomeEmail(customerEmail: string, customerData: any): Promise<void> {
    await this.sendEmail(
      customerEmail,
      'Welcome to Our Store',
      'welcome',
      customerData,
    );
  }
}
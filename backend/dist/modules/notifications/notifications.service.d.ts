import { ConfigService } from '@nestjs/config';
export declare class NotificationsService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendEmail(to: string, subject: string, template: string, context: any): Promise<void>;
    sendOrderConfirmation(customerEmail: string, orderData: any): Promise<void>;
    sendOrderStatusUpdate(customerEmail: string, orderData: any): Promise<void>;
    sendLowStockAlert(adminEmail: string, productData: any): Promise<void>;
    sendWelcomeEmail(customerEmail: string, customerData: any): Promise<void>;
}

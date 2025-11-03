"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
let NotificationsService = class NotificationsService {
    constructor(configService) {
        this.configService = configService;
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
    async sendEmail(to, subject, template, context) {
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
    async sendOrderConfirmation(customerEmail, orderData) {
        await this.sendEmail(customerEmail, 'Order Confirmation', 'order-confirmation', orderData);
    }
    async sendOrderStatusUpdate(customerEmail, orderData) {
        await this.sendEmail(customerEmail, 'Order Status Update', 'order-status-update', orderData);
    }
    async sendLowStockAlert(adminEmail, productData) {
        await this.sendEmail(adminEmail, 'Low Stock Alert', 'low-stock-alert', productData);
    }
    async sendWelcomeEmail(customerEmail, customerData) {
        await this.sendEmail(customerEmail, 'Welcome to Our Store', 'welcome', customerData);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map
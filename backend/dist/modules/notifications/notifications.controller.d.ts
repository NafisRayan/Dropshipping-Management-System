import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    sendTestEmail(body: {
        to: string;
        subject: string;
        message: string;
    }): Promise<{
        message: string;
    }>;
}

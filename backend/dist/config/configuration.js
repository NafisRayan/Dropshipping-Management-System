"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        type: 'sqlite',
        database: process.env.DATABASE_PATH || 'database.sqlite',
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV === 'development',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
    mail: {
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT, 10) || 587,
        secure: process.env.MAIL_SECURE === 'true',
        user: process.env.MAIL_USER,
        password: process.env.MAIL_PASSWORD,
        from: process.env.MAIL_FROM || 'noreply@dropshipping.com',
    },
    app: {
        name: 'Dropshipping Management System',
        url: process.env.APP_URL || 'http://localhost:3000',
    },
});
//# sourceMappingURL=configuration.js.map
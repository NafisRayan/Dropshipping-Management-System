"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
exports.jwtConfig = {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
    signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
};
//# sourceMappingURL=jwt.config.js.map
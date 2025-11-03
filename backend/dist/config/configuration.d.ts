declare const _default: () => {
    port: number;
    database: {
        type: string;
        database: string;
        synchronize: boolean;
        logging: boolean;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    mail: {
        host: string;
        port: number;
        secure: boolean;
        user: string;
        password: string;
        from: string;
    };
    app: {
        name: string;
        url: string;
    };
};
export default _default;

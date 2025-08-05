export interface AppConfig {
    mongodb: {
        uri: string;
    };
    services: {
        user: {
            url: string;
            timeout: number;
        };
        auth: {
            url: string;
            timeout: number;
        };
        balance: {
            url: string;
            timeout: number;
        };
    };
    api: {
        token: string;
        port: number;
        environment: string;
    };
    swagger: {
        title: string;
        description: string;
        version: string;
    };
    logging: {
        level: string;
    };
}
export declare const appConfig: AppConfig;

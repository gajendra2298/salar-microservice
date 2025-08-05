declare const _default: () => {
    port: number;
    nodeEnv: string;
    database: {
        uri: string;
    };
    api: {
        prefix: string;
    };
    swagger: {
        title: string;
        description: string;
        version: string;
    };
    cors: {
        origin: string;
        credentials: boolean;
    };
    logging: {
        level: string;
    };
};
export default _default;

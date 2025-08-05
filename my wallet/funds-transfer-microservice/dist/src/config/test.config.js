"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConfig = void 0;
exports.testConfig = {
    mongodb: {
        uri: 'mongodb://localhost:27017/funds-transfer-test',
    },
    services: {
        user: {
            url: 'http://localhost:9999',
            timeout: 1000,
        },
        auth: {
            url: 'http://localhost:9998',
            timeout: 1000,
        },
        balance: {
            url: 'http://localhost:9997',
            timeout: 1000,
        },
    },
    api: {
        token: 'test-token',
        port: 3002,
        environment: 'test',
    },
    swagger: {
        title: 'Funds Transfer Microservice Test',
        description: 'Test API for handling fund transfers between users',
        version: '1.0',
    },
    logging: {
        level: 'error',
    },
};
//# sourceMappingURL=test.config.js.map
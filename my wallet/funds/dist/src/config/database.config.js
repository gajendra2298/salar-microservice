"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    database: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/funds',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
});
//# sourceMappingURL=database.config.js.map
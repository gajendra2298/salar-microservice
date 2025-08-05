"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const configuration_1 = require("./configuration");
const database_config_1 = require("./database.config");
const Joi = require("joi");
let AppConfigModule = class AppConfigModule {
};
exports.AppConfigModule = AppConfigModule;
exports.AppConfigModule = AppConfigModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default, database_config_1.default],
                validationSchema: Joi.object({
                    NODE_ENV: Joi.string()
                        .valid('development', 'production', 'test')
                        .default('development'),
                    PORT: Joi.number().default(3001),
                    MONGODB_URI: Joi.string().required(),
                    API_PREFIX: Joi.string().default('api'),
                    SWAGGER_TITLE: Joi.string().default('Wallet Microservice API'),
                    SWAGGER_DESCRIPTION: Joi.string().default('API documentation for the Wallet Microservice'),
                    SWAGGER_VERSION: Joi.string().default('1.0'),
                    CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
                    CORS_CREDENTIALS: Joi.boolean().default(true),
                    LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('debug'),
                }),
                validationOptions: {
                    allowUnknown: true,
                    abortEarly: true,
                },
            }),
        ],
    })
], AppConfigModule);
//# sourceMappingURL=config.module.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const funds_received_controller_1 = require("./funds-received/funds-received.controller");
const funds_received_service_1 = require("./funds-received/funds-received.service");
const funds_schema_1 = require("./funds-received/schemas/funds.schema");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/funds-received'),
            mongoose_1.MongooseModule.forFeature([
                { name: 'Funds', schema: funds_schema_1.FundsSchema },
            ]),
        ],
        controllers: [funds_received_controller_1.FundsReceivedController],
        providers: [funds_received_service_1.FundsReceivedService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
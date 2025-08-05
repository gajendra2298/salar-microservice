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
const credit_debit_controller_1 = require("./credit-debit/credit-debit.controller");
const credit_debit_service_1 = require("./credit-debit/credit-debit.service");
const credit_debit_schema_1 = require("./credit-debit/schemas/credit-debit.schema");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/credit-debit'),
            mongoose_1.MongooseModule.forFeature([
                { name: 'CreditDebit', schema: credit_debit_schema_1.CreditDebitSchema },
            ]),
        ],
        controllers: [credit_debit_controller_1.CreditDebitController],
        providers: [credit_debit_service_1.CreditDebitService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
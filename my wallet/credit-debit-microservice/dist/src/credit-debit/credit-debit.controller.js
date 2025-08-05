"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditDebitController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const credit_debit_service_1 = require("./credit-debit.service");
let CreditDebitController = class CreditDebitController {
    constructor(creditDebitService) {
        this.creditDebitService = creditDebitService;
    }
    async creditDebitListing(data) {
        return await this.creditDebitService.creditDebitListing(data);
    }
    async createCreditDebit(creditDebitData) {
        return await this.creditDebitService.createCreditDebit(creditDebitData);
    }
};
exports.CreditDebitController = CreditDebitController;
__decorate([
    (0, common_1.Post)('listing'),
    (0, swagger_1.ApiOperation)({ summary: 'Get credit/debit listing' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string', description: 'User ID' },
                page: { type: 'number', description: 'Page number' },
                pagesize: { type: 'number', description: 'Page size' },
                startDate: { type: 'string', description: 'Start date (optional)' },
                endDate: { type: 'string', description: 'End date (optional)' },
                searchText: { type: 'string', description: 'Search text (optional)' },
                sort: { type: 'object', description: 'Sort options (optional)' }
            },
            required: ['userId', 'page', 'pagesize']
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Credit/debit listing retrieved successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CreditDebitController.prototype, "creditDebitListing", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create credit/debit entry' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string', description: 'User ID' },
                reason: { type: 'string', description: 'Reason for credit/debit' },
                orderId: { type: 'string', description: 'Order ID (optional)' },
                status: {
                    type: 'string',
                    enum: ['Credited', 'Debited'],
                    description: 'Status of the transaction'
                },
                type: { type: 'string', description: 'Type of transaction' },
                amount: { type: 'number', description: 'Amount' }
            },
            required: ['userId', 'reason', 'status', 'type', 'amount']
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Credit/debit entry created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CreditDebitController.prototype, "createCreditDebit", null);
exports.CreditDebitController = CreditDebitController = __decorate([
    (0, swagger_1.ApiTags)('credit-debit'),
    (0, common_1.Controller)('credit-debit'),
    __metadata("design:paramtypes", [credit_debit_service_1.CreditDebitService])
], CreditDebitController);
//# sourceMappingURL=credit-debit.controller.js.map
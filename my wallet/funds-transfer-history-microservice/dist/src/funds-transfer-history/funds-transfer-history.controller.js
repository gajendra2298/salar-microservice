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
exports.FundsTransferHistoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const funds_transfer_history_service_1 = require("./funds-transfer-history.service");
let FundsTransferHistoryController = class FundsTransferHistoryController {
    constructor(fundsTransferHistoryService) {
        this.fundsTransferHistoryService = fundsTransferHistoryService;
    }
    async saveTransferHistory(transferData) {
        try {
            return await this.fundsTransferHistoryService.saveTransferHistory(transferData);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Error saving transfer history', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getTransferHistory(userId, page = 1, limit = 10) {
        try {
            return await this.fundsTransferHistoryService.getTransferHistory(userId, page, limit);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Error retrieving transfer history', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.FundsTransferHistoryController = FundsTransferHistoryController;
__decorate([
    (0, common_1.Post)('save-transfer'),
    (0, swagger_1.ApiOperation)({
        summary: 'Save transfer history',
        description: 'Save transfer history from funds-transfer-microservice. This endpoint is called automatically when a transfer is processed.'
    }),
    (0, swagger_1.ApiBody)({
        description: 'Transfer history data to save',
        schema: {
            type: 'object',
            properties: {
                senderUserId: { type: 'string', example: '507f1f77bcf86cd799439011' },
                receiverUserId: { type: 'string', example: '507f1f77bcf86cd799439012' },
                receiverCustomerRegisteredId: { type: 'string', example: 'CUST123456' },
                customerName: { type: 'string', example: 'John Doe' },
                commissionType: { type: 'string', example: 'Referral Comm' },
                amount: { type: 'number', example: 1000.00 },
                adminCharges: { type: 'number', example: 50.00 },
                netPayable: { type: 'number', example: 950.00 },
                fundsTransactionNo: { type: 'string', example: 'TXN20241201001' },
                status: { type: 'string', enum: ['Success', 'Failed'], example: 'Success' },
                failureReason: { type: 'string', example: 'Insufficient balance' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Transfer history saved successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: 'Transfer history saved successfully' },
                data: {
                    type: 'object',
                    properties: {
                        serialNo: { type: 'number', example: 1 },
                        transferDate: { type: 'string', example: '2024-12-01T10:30:00.000Z' },
                        receiverCustomerRegisteredId: { type: 'string', example: 'CUST123456' },
                        customerName: { type: 'string', example: 'John Doe' },
                        fundsTransactionNo: { type: 'string', example: 'TXN20241201001' },
                        status: { type: 'string', example: 'Success' }
                    }
                }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FundsTransferHistoryController.prototype, "saveTransferHistory", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get funds transfer history',
        description: 'Retrieve funds transfer history as shown in the image. Returns S.No, Date, Receiver Customer Registered ID, Customer Name, Funds Transaction No, and Status for each transfer.'
    }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, description: 'Filter by user ID (sender or receiver)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number for pagination', type: 'number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Number of records per page', type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Transfer history retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: 'Transfer history retrieved successfully' },
                data: {
                    type: 'object',
                    properties: {
                        history: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    serialNo: { type: 'number', example: 1 },
                                    date: { type: 'string', example: '12/01/2024' },
                                    receiverCustomerRegisteredId: { type: 'string', example: 'CUST123456' },
                                    customerName: { type: 'string', example: 'John Doe' },
                                    fundsTransactionNo: { type: 'string', example: 'TXN20241201001' },
                                    status: { type: 'string', enum: ['Success', 'Failed'], example: 'Success' }
                                }
                            }
                        },
                        pagination: {
                            type: 'object',
                            properties: {
                                currentPage: { type: 'number', example: 1 },
                                totalPages: { type: 'number', example: 5 },
                                totalRecords: { type: 'number', example: 50 },
                                recordsPerPage: { type: 'number', example: 10 }
                            }
                        }
                    }
                }
            }
        }
    }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], FundsTransferHistoryController.prototype, "getTransferHistory", null);
exports.FundsTransferHistoryController = FundsTransferHistoryController = __decorate([
    (0, swagger_1.ApiTags)('funds-transfer-history'),
    (0, common_1.Controller)('funds-transfer-history'),
    __metadata("design:paramtypes", [funds_transfer_history_service_1.FundsTransferHistoryService])
], FundsTransferHistoryController);
//# sourceMappingURL=funds-transfer-history.controller.js.map
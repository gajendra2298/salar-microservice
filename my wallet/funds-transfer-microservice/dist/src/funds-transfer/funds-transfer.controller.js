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
exports.FundsTransferController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const funds_transfer_service_1 = require("./funds-transfer.service");
const transfer_form_dto_1 = require("./dto/transfer-form.dto");
let FundsTransferController = class FundsTransferController {
    constructor(fundsTransferService) {
        this.fundsTransferService = fundsTransferService;
    }
    async getDropdownValuesForFunds() {
        return await this.fundsTransferService.getDropdownValuesForFunds();
    }
    async fundTransfer(transferData) {
        return await this.fundsTransferService.fundTransfer(transferData);
    }
    async fundsTransferHistoryListing(listingData) {
        return await this.fundsTransferService.fundsTransferHistoryListing(listingData);
    }
    async fundsReceivedHistoryListing(listingData) {
        return await this.fundsTransferService.fundsReceivedHistoryListing(listingData);
    }
    async transferFunds(transferFormData) {
        try {
            if (!transferFormData || Object.keys(transferFormData).length === 0) {
                const commissionTypes = Object.entries(transfer_form_dto_1.CommissionLabels).map(([value, label]) => ({
                    value,
                    label,
                    description: `Transfer from ${label}`
                }));
                return {
                    success: true,
                    message: 'Commission types and form data retrieved successfully',
                    data: {
                        commissionTypes,
                        formFields: {
                            customerRegisteredId: '',
                            commissionType: '',
                            amount: 0,
                            transactionPassword: ''
                        }
                    }
                };
            }
            const transferData = {
                registerId: transferFormData.customerRegisteredId,
                amount: transferFormData.amount,
                type: transferFormData.commissionType,
                transactionPassword: transferFormData.transactionPassword
            };
            return await this.fundsTransferService.fundTransfer(transferData);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Internal server error during fund transfer', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.FundsTransferController = FundsTransferController;
__decorate([
    (0, common_1.Get)('dropdown-values'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get dropdown values for funds',
        description: 'Get user commission details for dropdown display'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Dropdown values retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'number', example: 1 },
                message: { type: 'string', example: 'User details are: ' },
                data: {
                    type: 'object',
                    properties: {
                        sponserCommission: { type: 'number', example: 1500.00 },
                        aurCommission: { type: 'number', example: 800.00 },
                        gameCommission: { type: 'number', example: 1200.00 },
                        funds: { type: 'number', example: 5000.00 }
                    }
                }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FundsTransferController.prototype, "getDropdownValuesForFunds", null);
__decorate([
    (0, common_1.Post)('transfer'),
    (0, swagger_1.ApiOperation)({
        summary: 'Fund transfer',
        description: 'Transfer funds between users with commission validation'
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                registerId: { type: 'string', example: 'CUST123456', description: 'Receiver register ID' },
                amount: { type: 'number', example: 100.00, description: 'Transfer amount' },
                type: {
                    type: 'string',
                    enum: ['Sponser Commission', 'Aur Commission', 'Game Commission', 'PRT Commission'],
                    example: 'Sponser Commission',
                    description: 'Commission type to transfer from'
                },
                transactionPassword: { type: 'string', example: 'password123', description: 'Transaction password' }
            },
            required: ['registerId', 'amount', 'type', 'transactionPassword']
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Funds transferred successfully',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'number', example: 1 },
                message: { type: 'string', example: 'Funds sent successfully' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation errors'
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - invalid transaction password'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'User not found'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FundsTransferController.prototype, "fundTransfer", null);
__decorate([
    (0, common_1.Post)('transfer-history'),
    (0, swagger_1.ApiOperation)({
        summary: 'Funds transfer history listing',
        description: 'Get paginated list of funds transfer history'
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                page: { type: 'number', example: 1, description: 'Page number' },
                pagesize: { type: 'number', example: 10, description: 'Records per page' },
                startDate: { type: 'string', example: '2022-09-20', description: 'Start date filter' },
                endDate: { type: 'string', example: '2024-10-25', description: 'End date filter' },
                searchText: { type: 'string', example: '', description: 'Search text' },
                sort: { type: 'object', description: 'Sort criteria' }
            },
            required: ['page', 'pagesize']
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Transfer history retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'number', example: 1 },
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
                            transactionNo: { type: 'string', example: 'FABC123456789' },
                            commissionName: { type: 'string', example: 'Sponser Commission' },
                            amount: { type: 'number', example: 100.00 },
                            receiver: {
                                type: 'object',
                                properties: {
                                    _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                                    fullName: { type: 'string', example: 'John Doe' },
                                    registerId: { type: 'string', example: 'CUST123456' }
                                }
                            },
                            status: { type: 'string', example: 'Success' }
                        }
                    }
                },
                page: { type: 'number', example: 1 },
                pagesize: { type: 'number', example: 10 },
                total: { type: 'number', example: 50 }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FundsTransferController.prototype, "fundsTransferHistoryListing", null);
__decorate([
    (0, common_1.Post)('received-history'),
    (0, swagger_1.ApiOperation)({
        summary: 'Funds received history listing',
        description: 'Get paginated list of funds received history'
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                page: { type: 'number', example: 1, description: 'Page number' },
                pagesize: { type: 'number', example: 10, description: 'Records per page' },
                startDate: { type: 'string', example: '2022-09-20', description: 'Start date filter' },
                endDate: { type: 'string', example: '2024-10-25', description: 'End date filter' },
                searchText: { type: 'string', example: '', description: 'Search text' },
                sort: { type: 'object', description: 'Sort criteria' }
            },
            required: ['page', 'pagesize']
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Received history retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'number', example: 1 },
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
                            transactionNo: { type: 'string', example: 'FABC123456789' },
                            commissionName: { type: 'string', example: 'Sponser Commission' },
                            amount: { type: 'number', example: 100.00 },
                            sender: {
                                type: 'object',
                                properties: {
                                    _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                                    fullName: { type: 'string', example: 'John Doe' },
                                    registerId: { type: 'string', example: 'CUST123456' },
                                    imageUrl: { type: 'string', example: 'https://example.com/image.jpg' }
                                }
                            },
                            status: { type: 'string', example: 'Success' }
                        }
                    }
                },
                page: { type: 'number', example: 1 },
                pagesize: { type: 'number', example: 10 },
                total: { type: 'number', example: 50 }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FundsTransferController.prototype, "fundsReceivedHistoryListing", null);
__decorate([
    (0, common_1.Post)('transfer-funds'),
    (0, swagger_1.ApiOperation)({
        summary: 'Transfer funds with commission validation and dropdown data',
        description: 'Complete funds transfer process with form validation. This endpoint automatically provides all available commission types for dropdown selection and processes the transfer. Supports both JSON and form data requests.'
    }),
    (0, swagger_1.ApiConsumes)('application/json', 'multipart/form-data'),
    (0, swagger_1.ApiBody)({
        type: transfer_form_dto_1.TransferFormDto,
        description: 'Funds transfer form data with commission type selection (supports both JSON and form data)',
        examples: {
            json: {
                summary: 'JSON Request',
                value: {
                    customerRegisteredId: 'CUST123456',
                    commissionType: transfer_form_dto_1.CommissionType.REFERRAL_COMM,
                    amount: 1000.00,
                    transactionPassword: 'password123'
                }
            },
            form: {
                summary: 'Form Data Request',
                value: {
                    customerRegisteredId: 'CUST123456',
                    commissionType: transfer_form_dto_1.CommissionType.REFERRAL_COMM,
                    amount: 1000.00,
                    transactionPassword: 'password123'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Commission types and transfer form data retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: 'Commission types and form data retrieved successfully' },
                data: {
                    type: 'object',
                    properties: {
                        commissionTypes: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    value: { type: 'string', example: 'Referral Comm' },
                                    label: { type: 'string', example: 'Referral Commission' },
                                    description: { type: 'string', example: 'Transfer from Referral Commission' }
                                }
                            }
                        },
                        formFields: {
                            type: 'object',
                            properties: {
                                customerRegisteredId: { type: 'string', example: '' },
                                commissionType: { type: 'string', example: '' },
                                amount: { type: 'number', example: 0 },
                                transactionPassword: { type: 'string', example: '' }
                            }
                        }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Funds transferred successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: 'Funds transferred successfully' },
                data: {
                    type: 'object',
                    properties: {
                        transactionNo: { type: 'string', example: 'TXN20241201001' },
                        senderId: { type: 'string', example: '507f1f77bcf86cd799439011' },
                        receiverId: { type: 'string', example: 'CUST123456' },
                        commissionType: { type: 'string', example: 'Referral Comm' },
                        amount: { type: 'number', example: 1000.00 },
                        adminCharges: { type: 'number', example: 50.00 },
                        netPayable: { type: 'number', example: 950.00 },
                        status: { type: 'string', example: 'Success' },
                        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation errors or insufficient balance'
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - invalid transaction password'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Customer or wallet not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error'
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transfer_form_dto_1.TransferFormDto]),
    __metadata("design:returntype", Promise)
], FundsTransferController.prototype, "transferFunds", null);
exports.FundsTransferController = FundsTransferController = __decorate([
    (0, swagger_1.ApiTags)('funds-transfer'),
    (0, common_1.Controller)('funds-transfer'),
    __metadata("design:paramtypes", [funds_transfer_service_1.FundsTransferService])
], FundsTransferController);
//# sourceMappingURL=funds-transfer.controller.js.map
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
const funds_transfer_service_1 = require("./funds-transfer.service");
class TransferDataDto {
}
let FundsTransferController = class FundsTransferController {
    constructor(fundsTransferService) {
        this.fundsTransferService = fundsTransferService;
    }
    async getDropdownValuesForFunds(userId) {
        try {
            return await this.fundsTransferService.getDropdownValuesForFunds(userId);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Internal server error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async fundTransfer(transferData) {
        try {
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
    (0, common_1.Get)('dropdown-values/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dropdown values for funds transfer', description: 'Retrieves available options for funds transfer dropdown based on user ID from external user service' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID to get dropdown values for' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dropdown values retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized access to user service' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 503, description: 'User service unavailable' }),
    (0, swagger_1.ApiResponse)({ status: 408, description: 'Request timeout' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FundsTransferController.prototype, "getDropdownValuesForFunds", null);
__decorate([
    (0, common_1.Post)('transfer'),
    (0, swagger_1.ApiOperation)({ summary: 'Transfer funds', description: 'Transfer funds between accounts with transaction password verification using external services' }),
    (0, swagger_1.ApiBody)({ type: TransferDataDto, description: 'Transfer data including user details and amount' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Funds transferred successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - invalid transfer data, insufficient balance, or same user transfer' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - invalid transaction password' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Receiver user not found' }),
    (0, swagger_1.ApiResponse)({ status: 503, description: 'External services unavailable' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TransferDataDto]),
    __metadata("design:returntype", Promise)
], FundsTransferController.prototype, "fundTransfer", null);
exports.FundsTransferController = FundsTransferController = __decorate([
    (0, swagger_1.ApiTags)('funds-transfer'),
    (0, common_1.Controller)('funds-transfer'),
    __metadata("design:paramtypes", [funds_transfer_service_1.FundsTransferService])
], FundsTransferController);
//# sourceMappingURL=funds-transfer.controller.js.map
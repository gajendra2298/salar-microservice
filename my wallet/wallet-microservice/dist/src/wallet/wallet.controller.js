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
exports.WalletController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const wallet_service_1 = require("./wallet.service");
const update_wallet_dto_1 = require("./dto/update-wallet.dto");
const wallet_response_dto_1 = require("./dto/wallet-response.dto");
const get_wallet_balance_dto_1 = require("./dto/get-wallet-balance.dto");
let WalletController = class WalletController {
    constructor(walletService) {
        this.walletService = walletService;
    }
    async getWalletBalance(data) {
        if (!data.userId) {
            throw new common_1.BadRequestException('userId is required');
        }
        const result = await this.walletService.getWalletBalance(data.userId);
        if (result.status === 0) {
            throw new common_1.HttpException(result.message, common_1.HttpStatus.BAD_REQUEST);
        }
        return result;
    }
    async updateWalletBalance(updateWalletDto) {
        if (!updateWalletDto.userId) {
            throw new common_1.BadRequestException('userId is required');
        }
        const { userId, ...updates } = updateWalletDto;
        const result = await this.walletService.updateWalletBalance(userId, updates);
        if (result.status === 0) {
            throw new common_1.HttpException(result.message, common_1.HttpStatus.BAD_REQUEST);
        }
        return result;
    }
};
exports.WalletController = WalletController;
__decorate([
    (0, common_1.Post)('balance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get wallet balance for a user' }),
    (0, swagger_1.ApiBody)({ type: get_wallet_balance_dto_1.GetWalletBalanceDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Wallet balance retrieved successfully',
        type: wallet_response_dto_1.WalletResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid user ID' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Wallet not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_wallet_balance_dto_1.GetWalletBalanceDto]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getWalletBalance", null);
__decorate([
    (0, common_1.Post)('update-balance'),
    (0, swagger_1.ApiOperation)({ summary: 'Update wallet balance for a user' }),
    (0, swagger_1.ApiBody)({ type: update_wallet_dto_1.UpdateWalletDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Wallet balance updated successfully',
        type: wallet_response_dto_1.WalletResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request data' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Wallet not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_wallet_dto_1.UpdateWalletDto]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "updateWalletBalance", null);
exports.WalletController = WalletController = __decorate([
    (0, swagger_1.ApiTags)('wallet'),
    (0, common_1.Controller)('wallet'),
    __metadata("design:paramtypes", [wallet_service_1.WalletService])
], WalletController);
//# sourceMappingURL=wallet.controller.js.map
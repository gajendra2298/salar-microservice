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
exports.FundsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const funds_service_1 = require("./funds.service");
const fund_transfer_dto_1 = require("./dto/fund-transfer.dto");
const fund_history_dto_1 = require("./dto/fund-history.dto");
const user_details_dto_1 = require("./dto/user-details.dto");
const fund_response_dto_1 = require("./dto/fund-response.dto");
let FundsController = class FundsController {
    constructor(fundsService) {
        this.fundsService = fundsService;
    }
    async getDropdownValuesForFunds(userDetailsDto) {
        try {
            const { userId } = userDetailsDto;
            return await this.fundsService.getDropdownValuesForFunds(userId);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 0,
                message: error.message || 'Internal server error',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async fundTransfer(fundTransferDto) {
        try {
            const { userId } = fundTransferDto;
            return await this.fundsService.fundTransfer(userId, fundTransferDto);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 0,
                message: error.message || 'Internal server error',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async fundsTransferHistoryListing(historyDto) {
        try {
            const { userId } = historyDto;
            return await this.fundsService.fundsTransferHistoryListing(userId, historyDto);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 0,
                message: error.message || 'Internal server error',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async fundsReceivedHistoryListing(historyDto) {
        try {
            const { userId } = historyDto;
            return await this.fundsService.fundsReceivedHistoryListing(userId, historyDto);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 0,
                message: error.message || 'Internal server error',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTransactionDetails(transactionNo) {
        try {
            return await this.fundsService.getFundRecordByTransactionNo(transactionNo);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 0,
                message: error.message || 'Transaction not found',
            }, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async getAllFundRecords(userDetailsDto) {
        try {
            const { userId } = userDetailsDto;
            return await this.fundsService.getAllFundRecordsByUserId(userId);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 0,
                message: error.message || 'Internal server error',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getFundStatistics(userDetailsDto) {
        try {
            const { userId } = userDetailsDto;
            return await this.fundsService.getFundStatisticsByUserId(userId);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 0,
                message: error.message || 'Internal server error',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.FundsController = FundsController;
__decorate([
    (0, common_1.Post)('dropdown-values'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get dropdown values for funds',
        description: 'Retrieve user commission and fund details for dropdown display',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User details retrieved successfully',
        type: fund_response_dto_1.UserDetailsResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - User details not found',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_details_dto_1.UserDetailsDto]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "getDropdownValuesForFunds", null);
__decorate([
    (0, common_1.Post)('transfer'),
    (0, swagger_1.ApiOperation)({
        summary: 'Transfer funds',
        description: 'Transfer funds from one user to another with proper validations',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Funds transferred successfully',
        type: fund_response_dto_1.FundTransferResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Validation failed or insufficient funds',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fund_transfer_dto_1.FundTransferDto]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "fundTransfer", null);
__decorate([
    (0, common_1.Post)('transfer-history'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get funds transfer history',
        description: 'Retrieve paginated list of funds sent by the user',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Transfer history retrieved successfully',
        type: fund_response_dto_1.FundHistoryListResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid parameters',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fund_history_dto_1.FundHistoryDto]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "fundsTransferHistoryListing", null);
__decorate([
    (0, common_1.Post)('received-history'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get funds received history',
        description: 'Retrieve paginated list of funds received by the user',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Received history retrieved successfully',
        type: fund_response_dto_1.FundHistoryListResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid parameters',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fund_history_dto_1.FundHistoryDto]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "fundsReceivedHistoryListing", null);
__decorate([
    (0, common_1.Get)('transaction/:transactionNo'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get transaction details',
        description: 'Retrieve details of a specific transaction by transaction number',
    }),
    (0, swagger_1.ApiParam)({
        name: 'transactionNo',
        description: 'Transaction number to search for',
        example: 'FABCD123456789',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Transaction details retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Transaction not found',
    }),
    __param(0, (0, common_1.Param)('transactionNo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "getTransactionDetails", null);
__decorate([
    (0, common_1.Post)('all-records'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all fund records for a user',
        description: 'Retrieve all fund records (both sent and received) for a specific user',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Fund records retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid user ID',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_details_dto_1.UserDetailsDto]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "getAllFundRecords", null);
__decorate([
    (0, common_1.Post)('statistics'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get fund statistics for a user',
        description: 'Retrieve comprehensive fund statistics including sent, received, and net amounts',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Fund statistics retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid user ID',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_details_dto_1.UserDetailsDto]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "getFundStatistics", null);
exports.FundsController = FundsController = __decorate([
    (0, swagger_1.ApiTags)('Funds'),
    (0, common_1.Controller)('funds'),
    __metadata("design:paramtypes", [funds_service_1.FundsService])
], FundsController);
//# sourceMappingURL=funds.controller.js.map
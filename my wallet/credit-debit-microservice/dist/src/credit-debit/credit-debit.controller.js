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
const credit_debit_listing_dto_1 = require("./dto/credit-debit-listing.dto");
const create_credit_debit_dto_1 = require("./dto/create-credit-debit.dto");
const credit_debit_response_dto_1 = require("./dto/credit-debit-response.dto");
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
    (0, swagger_1.ApiOperation)({
        summary: 'Get credit/debit listing',
        description: 'Retrieve paginated list of credit/debit transactions with optional filtering and search'
    }),
    (0, swagger_1.ApiBody)({ type: credit_debit_listing_dto_1.CreditDebitListingDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Credit/debit listing retrieved successfully',
        type: credit_debit_response_dto_1.CreditDebitListingResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid parameters or user not found'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [credit_debit_listing_dto_1.CreditDebitListingDto]),
    __metadata("design:returntype", Promise)
], CreditDebitController.prototype, "creditDebitListing", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create credit/debit entry',
        description: 'Create a new credit or debit transaction for a user'
    }),
    (0, swagger_1.ApiBody)({ type: create_credit_debit_dto_1.CreateCreditDebitDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Credit/debit entry created successfully',
        type: credit_debit_response_dto_1.CreateCreditDebitResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid parameters or user not found'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_credit_debit_dto_1.CreateCreditDebitDto]),
    __metadata("design:returntype", Promise)
], CreditDebitController.prototype, "createCreditDebit", null);
exports.CreditDebitController = CreditDebitController = __decorate([
    (0, swagger_1.ApiTags)('credit-debit'),
    (0, common_1.Controller)('credit-debit'),
    __metadata("design:paramtypes", [credit_debit_service_1.CreditDebitService])
], CreditDebitController);
//# sourceMappingURL=credit-debit.controller.js.map
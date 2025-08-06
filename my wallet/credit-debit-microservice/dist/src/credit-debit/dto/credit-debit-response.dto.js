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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCreditDebitResponseDto = exports.CreditDebitListingResponseDto = exports.CreditDebitTransactionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreditDebitTransactionDto {
}
exports.CreditDebitTransactionDto = CreditDebitTransactionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Transaction creation date',
        example: '2024-01-15T10:30:00.000Z'
    }),
    __metadata("design:type", Date)
], CreditDebitTransactionDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique transaction number',
        example: 'CDABC123456789'
    }),
    __metadata("design:type", String)
], CreditDebitTransactionDto.prototype, "transactionNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status of the transaction',
        example: 'Credited'
    }),
    __metadata("design:type", String)
], CreditDebitTransactionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of transaction',
        example: 'Referral Comm'
    }),
    __metadata("design:type", String)
], CreditDebitTransactionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount of the transaction',
        example: 100
    }),
    __metadata("design:type", Number)
], CreditDebitTransactionDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for the transaction',
        example: 'Referral Bonus'
    }),
    __metadata("design:type", String)
], CreditDebitTransactionDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Order ID (if applicable)',
        example: 'ORDER123'
    }),
    __metadata("design:type", String)
], CreditDebitTransactionDto.prototype, "orderId", void 0);
class CreditDebitListingResponseDto {
}
exports.CreditDebitListingResponseDto = CreditDebitListingResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response status (1 for success, 0 for error)',
        example: 1
    }),
    __metadata("design:type", Number)
], CreditDebitListingResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of credit/debit transactions',
        type: [CreditDebitTransactionDto]
    }),
    __metadata("design:type", Array)
], CreditDebitListingResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current page number',
        example: 1
    }),
    __metadata("design:type", Number)
], CreditDebitListingResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items per page',
        example: 10
    }),
    __metadata("design:type", Number)
], CreditDebitListingResponseDto.prototype, "pagesize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of transactions',
        example: 25
    }),
    __metadata("design:type", Number)
], CreditDebitListingResponseDto.prototype, "total", void 0);
class CreateCreditDebitResponseDto {
}
exports.CreateCreditDebitResponseDto = CreateCreditDebitResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response status (1 for success, 0 for error)',
        example: 1
    }),
    __metadata("design:type", Number)
], CreateCreditDebitResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Success message',
        example: 'Credit/Debit transaction created successfully'
    }),
    __metadata("design:type", String)
], CreateCreditDebitResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Created transaction details',
        type: CreditDebitTransactionDto
    }),
    __metadata("design:type", CreditDebitTransactionDto)
], CreateCreditDebitResponseDto.prototype, "data", void 0);
//# sourceMappingURL=credit-debit-response.dto.js.map
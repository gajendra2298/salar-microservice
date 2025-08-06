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
exports.UserDetailsResponseDto = exports.FundTransferResponseDto = exports.FundHistoryListResponseDto = exports.FundHistoryResponseDto = exports.FundResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const funds_schema_1 = require("../schemas/funds.schema");
class FundResponseDto {
}
exports.FundResponseDto = FundResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FundResponseDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FundResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FundResponseDto.prototype, "receiverUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: funds_schema_1.FundType }),
    __metadata("design:type", String)
], FundResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FundResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FundResponseDto.prototype, "transactionNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: funds_schema_1.FundStatus }),
    __metadata("design:type", String)
], FundResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], FundResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], FundResponseDto.prototype, "updatedAt", void 0);
class FundHistoryResponseDto {
}
exports.FundHistoryResponseDto = FundHistoryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], FundHistoryResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FundHistoryResponseDto.prototype, "transactionNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: funds_schema_1.FundType }),
    __metadata("design:type", String)
], FundHistoryResponseDto.prototype, "commissionName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FundHistoryResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FundHistoryResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], FundHistoryResponseDto.prototype, "receiver", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], FundHistoryResponseDto.prototype, "sender", void 0);
class FundHistoryListResponseDto {
}
exports.FundHistoryListResponseDto = FundHistoryListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FundHistoryListResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [FundHistoryResponseDto] }),
    __metadata("design:type", Array)
], FundHistoryListResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FundHistoryListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FundHistoryListResponseDto.prototype, "pagesize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FundHistoryListResponseDto.prototype, "total", void 0);
class FundTransferResponseDto {
}
exports.FundTransferResponseDto = FundTransferResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FundTransferResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FundTransferResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], FundTransferResponseDto.prototype, "data", void 0);
class UserDetailsResponseDto {
}
exports.UserDetailsResponseDto = UserDetailsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UserDetailsResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserDetailsResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], UserDetailsResponseDto.prototype, "data", void 0);
//# sourceMappingURL=fund-response.dto.js.map
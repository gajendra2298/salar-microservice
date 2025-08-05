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
exports.TransferFormDto = exports.CommissionLabels = exports.CommissionType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var CommissionType;
(function (CommissionType) {
    CommissionType["REFERRAL_COMM"] = "Referral Comm";
    CommissionType["SPONSOR_COMM"] = "Sponsor Comm";
    CommissionType["AUS_COMM"] = "AuS Comm";
    CommissionType["PRODUCT_TEAM_REFERRAL_COMMISSION"] = "Product Team Referral Commission";
    CommissionType["NOVA_REFERRAL_COMMISSION"] = "Nova Referral Commission";
    CommissionType["ROYALTY_REFERRAL_TEAM_COMMISSION"] = "Royalty Referral Team Commission";
})(CommissionType || (exports.CommissionType = CommissionType = {}));
exports.CommissionLabels = {
    [CommissionType.REFERRAL_COMM]: 'Referral Commission',
    [CommissionType.SPONSOR_COMM]: 'Sponsor Commission',
    [CommissionType.AUS_COMM]: 'AuS Commission',
    [CommissionType.PRODUCT_TEAM_REFERRAL_COMMISSION]: 'Product Team Referral Commission',
    [CommissionType.NOVA_REFERRAL_COMMISSION]: 'Nova Referral Commission',
    [CommissionType.ROYALTY_REFERRAL_TEAM_COMMISSION]: 'Royalty Referral Team Commission'
};
class TransferFormDto {
}
exports.TransferFormDto = TransferFormDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Customer Registered ID of the recipient',
        example: 'CUST123456',
        required: true,
        type: 'string'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TransferFormDto.prototype, "customerRegisteredId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of commission to transfer from',
        enum: CommissionType,
        example: CommissionType.REFERRAL_COMM,
        required: true,
        type: 'string'
    }),
    (0, class_validator_1.IsEnum)(CommissionType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TransferFormDto.prototype, "commissionType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount to transfer (must be less than or equal to available commission amount)',
        example: 1000.00,
        minimum: 0.01,
        required: true,
        type: 'number'
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], TransferFormDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Transaction password for verification',
        example: 'password123',
        minLength: 6,
        maxLength: 50,
        required: true,
        type: 'string'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], TransferFormDto.prototype, "transactionPassword", void 0);
//# sourceMappingURL=transfer-form.dto.js.map
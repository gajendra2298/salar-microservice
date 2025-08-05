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
exports.UpdateWalletDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateWalletDto {
}
exports.UpdateWalletDto = UpdateWalletDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID (MongoDB ObjectId)',
        example: '507f1f77bcf86cd799439011',
        required: true
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], UpdateWalletDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Referral commission amount',
        example: 100.50,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateWalletDto.prototype, "referralComm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sponsor commission amount',
        example: 50.25,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateWalletDto.prototype, "sponsorComm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'AUS commission amount',
        example: 75.00,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateWalletDto.prototype, "ausComm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product team referral commission amount',
        example: 25.00,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateWalletDto.prototype, "productTeamReferralCommission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nova referral commission amount',
        example: 30.00,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateWalletDto.prototype, "novaReferralCommission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Royalty referral team commission amount',
        example: 40.00,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateWalletDto.prototype, "royaltyReferralTeamCommission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Shopping amount',
        example: 200.00,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateWalletDto.prototype, "shoppingAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Salar coins amount',
        example: 150.00,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateWalletDto.prototype, "salarCoins", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Royalty credits amount',
        example: 80.00,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateWalletDto.prototype, "royaltyCredits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Salar gift credits amount',
        example: 60.00,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateWalletDto.prototype, "salarGiftCredits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Funds amount',
        example: 500.00,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateWalletDto.prototype, "funds", void 0);
//# sourceMappingURL=update-wallet.dto.js.map
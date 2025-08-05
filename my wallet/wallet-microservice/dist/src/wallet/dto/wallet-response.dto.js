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
exports.WalletResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class WalletResponseDto {
}
exports.WalletResponseDto = WalletResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Operation status (1 for success, 0 for failure)',
        example: 1
    }),
    __metadata("design:type", Number)
], WalletResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response message',
        example: 'Wallet balance retrieved successfully'
    }),
    __metadata("design:type", String)
], WalletResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Wallet data',
        example: {
            userId: '507f1f77bcf86cd799439011',
            balance: 1000.50,
            currency: 'USD',
            updatedAt: '2024-01-01T00:00:00.000Z'
        },
        required: false
    }),
    __metadata("design:type", Object)
], WalletResponseDto.prototype, "data", void 0);
//# sourceMappingURL=wallet-response.dto.js.map
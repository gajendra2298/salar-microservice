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
exports.FundsReceivedResponseDto = exports.FundsReceivedListingDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class FundsReceivedListingDto {
}
exports.FundsReceivedListingDto = FundsReceivedListingDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID for filtering funds received',
        example: '507f1f77bcf86cd799439011'
    }),
    __metadata("design:type", String)
], FundsReceivedListingDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Page number for pagination',
        example: 1,
        minimum: 1
    }),
    __metadata("design:type", Number)
], FundsReceivedListingDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items per page',
        example: 10,
        minimum: 1,
        maximum: 100
    }),
    __metadata("design:type", Number)
], FundsReceivedListingDto.prototype, "pagesize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Start date for filtering (ISO 8601 format)',
        example: '2024-01-01T00:00:00.000Z',
        required: false
    }),
    __metadata("design:type", String)
], FundsReceivedListingDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'End date for filtering (ISO 8601 format)',
        example: '2024-12-31T23:59:59.999Z',
        required: false
    }),
    __metadata("design:type", String)
], FundsReceivedListingDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search text for filtering results',
        example: 'payment',
        required: false
    }),
    __metadata("design:type", String)
], FundsReceivedListingDto.prototype, "searchText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sorting options',
        example: { field: 'createdAt', order: 'desc' },
        required: false
    }),
    __metadata("design:type", Object)
], FundsReceivedListingDto.prototype, "sort", void 0);
class FundsReceivedResponseDto {
}
exports.FundsReceivedResponseDto = FundsReceivedResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of funds received records',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                userId: { type: 'string' },
                amount: { type: 'number' },
                currency: { type: 'string' },
                description: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' }
            }
        }
    }),
    __metadata("design:type", Array)
], FundsReceivedResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of records',
        example: 100
    }),
    __metadata("design:type", Number)
], FundsReceivedResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current page number',
        example: 1
    }),
    __metadata("design:type", Number)
], FundsReceivedResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items per page',
        example: 10
    }),
    __metadata("design:type", Number)
], FundsReceivedResponseDto.prototype, "pagesize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of pages',
        example: 10
    }),
    __metadata("design:type", Number)
], FundsReceivedResponseDto.prototype, "totalPages", void 0);
//# sourceMappingURL=funds-received.dto.js.map
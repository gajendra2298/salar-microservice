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
exports.FundsReceivedController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const funds_received_service_1 = require("./funds-received.service");
const funds_received_dto_1 = require("./dto/funds-received.dto");
let FundsReceivedController = class FundsReceivedController {
    constructor(fundsReceivedService) {
        this.fundsReceivedService = fundsReceivedService;
    }
    async fundsReceivedHistoryListing(data) {
        return await this.fundsReceivedService.fundsReceivedHistoryListing(data);
    }
};
exports.FundsReceivedController = FundsReceivedController;
__decorate([
    (0, common_1.Post)('listing'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get funds received history listing',
        description: 'Retrieve a paginated list of funds received for a specific user with optional filtering and sorting'
    }),
    (0, swagger_1.ApiBody)({
        type: funds_received_dto_1.FundsReceivedListingDto,
        description: 'Request body for funds received listing'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully retrieved funds received listing',
        type: funds_received_dto_1.FundsReceivedResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid input parameters'
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [funds_received_dto_1.FundsReceivedListingDto]),
    __metadata("design:returntype", Promise)
], FundsReceivedController.prototype, "fundsReceivedHistoryListing", null);
exports.FundsReceivedController = FundsReceivedController = __decorate([
    (0, swagger_1.ApiTags)('Funds Received'),
    (0, common_1.Controller)('funds-received'),
    __metadata("design:paramtypes", [funds_received_service_1.FundsReceivedService])
], FundsReceivedController);
//# sourceMappingURL=funds-received.controller.js.map
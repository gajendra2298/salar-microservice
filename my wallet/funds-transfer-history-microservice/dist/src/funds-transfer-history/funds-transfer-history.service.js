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
exports.FundsTransferHistoryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const funds_schema_1 = require("./schemas/funds.schema");
let FundsTransferHistoryService = class FundsTransferHistoryService {
    constructor(fundsModel) {
        this.fundsModel = fundsModel;
    }
    async fundsTransferHistoryListing(data) {
        try {
            const { userId, page, pagesize, startDate, endDate, searchText, sort } = data;
            const skip = (parseInt(page.toString()) - 1) * parseInt(pagesize.toString());
            const sortOption = sort || { _id: -1 };
            const limit = pagesize;
            const matchConditions = { userId };
            if (startDate || endDate) {
                const dateFilter = {};
                if (startDate) {
                    dateFilter.$gte = new Date(startDate);
                }
                if (endDate) {
                    dateFilter.$lte = new Date(endDate);
                }
                matchConditions.createdAt = dateFilter;
            }
            if (searchText) {
                const searchRegex = { $regex: `.*${searchText}.*`, $options: 'i' };
                matchConditions.$or = [
                    { type: searchRegex },
                    { transactionNo: searchRegex },
                ];
            }
            const pipeline = [
                { $match: matchConditions },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'receiverUserId',
                        foreignField: '_id',
                        as: 'receiver',
                    },
                },
                { $unwind: { path: '$receiver', preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        createdAt: 1,
                        transactionNo: 1,
                        commissionName: '$type',
                        amount: 1,
                        'receiver._id': 1,
                        'receiver.fullName': 1,
                        'receiver.registerId': 1,
                        status: 1,
                    },
                },
                { $sort: sortOption },
                { $skip: skip },
                { $limit: limit },
            ];
            const result = await this.fundsModel.aggregate(pipeline);
            const totalPipeline = [
                { $match: matchConditions },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'receiverUserId',
                        foreignField: '_id',
                        as: 'receiver',
                    },
                },
                { $unwind: { path: '$receiver', preserveNullAndEmptyArrays: true } },
                { $project: { _id: 1 } },
            ];
            const total = await this.fundsModel.aggregate(totalPipeline);
            return {
                status: 1,
                data: result,
                page,
                pagesize,
                total: total.length,
            };
        }
        catch (error) {
            console.error('Error in funds transfer history listing:', error);
            return {
                status: 0,
                message: 'Internal server error',
            };
        }
    }
};
exports.FundsTransferHistoryService = FundsTransferHistoryService;
exports.FundsTransferHistoryService = FundsTransferHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(funds_schema_1.Funds.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FundsTransferHistoryService);
//# sourceMappingURL=funds-transfer-history.service.js.map
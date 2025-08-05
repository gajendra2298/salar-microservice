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
exports.FundsReceivedService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const funds_schema_1 = require("./schemas/funds.schema");
let FundsReceivedService = class FundsReceivedService {
    constructor(fundsModel) {
        this.fundsModel = fundsModel;
    }
    async fundsReceivedHistoryListing(data) {
        try {
            const { userId, page, pagesize, startDate, endDate, searchText, sort } = data;
            const skip = (parseInt(page.toString()) - 1) * parseInt(pagesize.toString());
            const sortOption = sort || { _id: -1 };
            const limit = pagesize;
            const matchConditions = { receiverUserId: userId };
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
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'sender',
                    },
                },
                { $unwind: { path: '$sender', preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        createdAt: 1,
                        transactionNo: 1,
                        commissionName: '$type',
                        amount: 1,
                        'sender._id': 1,
                        'sender.fullName': 1,
                        'sender.registerId': 1,
                        'sender.imageUrl': 1,
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
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'sender',
                    },
                },
                { $unwind: { path: '$sender', preserveNullAndEmptyArrays: true } },
                { $project: { _id: 1 } },
            ];
            const total = await this.fundsModel.aggregate(totalPipeline);
            const totalCount = total.length;
            const totalPages = Math.ceil(totalCount / pagesize);
            return {
                data: result,
                page,
                pagesize,
                total: totalCount,
                totalPages,
            };
        }
        catch (error) {
            console.error('Error in funds received history listing:', error);
            return {
                data: [],
                page: 1,
                pagesize: 10,
                total: 0,
                totalPages: 0,
            };
        }
    }
};
exports.FundsReceivedService = FundsReceivedService;
exports.FundsReceivedService = FundsReceivedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(funds_schema_1.Funds.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FundsReceivedService);
//# sourceMappingURL=funds-received.service.js.map
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
exports.CreditDebitService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const credit_debit_schema_1 = require("./schemas/credit-debit.schema");
let CreditDebitService = class CreditDebitService {
    constructor(creditDebitModel) {
        this.creditDebitModel = creditDebitModel;
    }
    async creditDebitListing(data) {
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
                    { reason: searchRegex },
                    { status: searchRegex },
                    { orderId: searchRegex },
                ];
            }
            const pipeline = [
                { $match: matchConditions },
                {
                    $project: {
                        createdAt: 1,
                        transactionNo: 1,
                        status: 1,
                        type: 1,
                        amount: 1,
                        reason: 1,
                        orderId: 1,
                    },
                },
                { $sort: sortOption },
                { $skip: skip },
                { $limit: limit },
            ];
            const result = await this.creditDebitModel.aggregate(pipeline);
            const totalPipeline = [
                { $match: matchConditions },
                { $project: { _id: 1 } },
            ];
            const total = await this.creditDebitModel.aggregate(totalPipeline);
            return {
                status: 1,
                data: result,
                page,
                pagesize,
                total: total.length,
            };
        }
        catch (error) {
            console.error('Error in credit/debit listing:', error);
            return {
                status: 0,
                message: 'Internal server error',
            };
        }
    }
    async createCreditDebit(creditDebitData) {
        try {
            const creditDebitCount = await this.creditDebitModel.countDocuments();
            const randomGenerator = this.generateRandomString(8);
            const transactionNo = 'CD' + randomGenerator + (creditDebitCount + 1);
            const newCreditDebit = await this.creditDebitModel.create({
                ...creditDebitData,
                transactionNo,
            });
            return {
                status: 1,
                message: 'Credit/Debit transaction created successfully',
                data: newCreditDebit,
            };
        }
        catch (error) {
            console.error('Error creating credit/debit transaction:', error);
            return {
                status: 0,
                message: 'Failed to create credit/debit transaction',
            };
        }
    }
    generateRandomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
};
exports.CreditDebitService = CreditDebitService;
exports.CreditDebitService = CreditDebitService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(credit_debit_schema_1.CreditDebit.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CreditDebitService);
//# sourceMappingURL=credit-debit.service.js.map
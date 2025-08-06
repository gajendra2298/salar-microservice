"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const mockUserData = __importStar(require("./mock-data/user-details.mock.json"));
const _ = __importStar(require("lodash"));
let CreditDebitService = class CreditDebitService {
    constructor(creditDebitModel) {
        this.creditDebitModel = creditDebitModel;
        this.mockUsers = mockUserData.users;
    }
    findUserFromMockData(userId) {
        let user = this.mockUsers.find(u => u.registerId === userId);
        if (_.isEmpty(user)) {
            user = this.mockUsers.find(u => u._id === userId);
        }
        if (_.isEmpty(user)) {
            user = this.mockUsers.find(u => u.emailId === userId);
        }
        return user;
    }
    async creditDebitListing(data) {
        try {
            const { userId, page, pagesize, startDate, endDate, searchText, sort } = data;
            const user = this.findUserFromMockData(userId);
            if (!user) {
                throw new common_1.BadRequestException('User not found');
            }
            const skip = (parseInt(page.toString()) - 1) * parseInt(pagesize.toString());
            const sortOption = sort || { _id: -1 };
            const limit = pagesize;
            const matchConditions = { userId: new mongoose_2.Types.ObjectId(user._id) };
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
            const user = this.findUserFromMockData(creditDebitData.userId);
            if (!user) {
                throw new common_1.BadRequestException('User not found');
            }
            const creditDebitCount = await this.creditDebitModel.countDocuments();
            const randomGenerator = this.generateRandomString(8);
            const transactionNo = 'CD' + randomGenerator + (creditDebitCount + 1);
            const newCreditDebit = await this.creditDebitModel.create({
                ...creditDebitData,
                userId: new mongoose_2.Types.ObjectId(user._id),
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
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
exports.FundsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const funds_schema_1 = require("./schemas/funds.schema");
const mockUserData = __importStar(require("./mock-data/user-details.mock.json"));
const _ = __importStar(require("lodash"));
let FundsService = class FundsService {
    constructor(fundsModel) {
        this.fundsModel = fundsModel;
        this.mockUsers = mockUserData.users;
    }
    async generateTransactionNo() {
        const fundsCount = await this.fundsModel.countDocuments();
        const randomGenerator = this.generateRandomString(8, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        return 'F' + randomGenerator + (fundsCount + 1);
    }
    generateRandomString(length, chars) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    getMockUserData(userId) {
        const mockUsers = {
            '507f1f77bcf86cd799439011': {
                _id: '507f1f77bcf86cd799439011',
                registerId: 'USER001',
                fullName: 'John Doe',
                email: 'john@example.com',
                mobile: '+1234567890',
                sponserCommission: 1000,
                aurCommission: 500,
                gameCommission: 750,
                funds: 2000,
                prtCommission: 300,
                status: true,
                isDeleted: false,
                transactionPassword: 'password123',
            },
            '507f1f77bcf86cd799439012': {
                _id: '507f1f77bcf86cd799439012',
                registerId: 'USER002',
                fullName: 'Jane Smith',
                email: 'jane@example.com',
                mobile: '+0987654321',
                sponserCommission: 800,
                aurCommission: 400,
                gameCommission: 600,
                funds: 1500,
                prtCommission: 200,
                status: true,
                isDeleted: false,
                transactionPassword: 'password456',
            },
        };
        return mockUsers[userId] || null;
    }
    getMockUserByRegisterId(registerId) {
        const mockUsers = {
            'USER001': {
                _id: '507f1f77bcf86cd799439011',
                registerId: 'USER001',
                fullName: 'John Doe',
                email: 'john@example.com',
                mobile: '+1234567890',
                sponserCommission: 1000,
                aurCommission: 500,
                gameCommission: 750,
                funds: 2000,
                prtCommission: 300,
                status: true,
                isDeleted: false,
            },
            'USER002': {
                _id: '507f1f77bcf86cd799439012',
                registerId: 'USER002',
                fullName: 'Jane Smith',
                email: 'jane@example.com',
                mobile: '+0987654321',
                sponserCommission: 800,
                aurCommission: 400,
                gameCommission: 600,
                funds: 1500,
                prtCommission: 200,
                status: true,
                isDeleted: false,
            },
        };
        return mockUsers[registerId] || null;
    }
    verifyTransactionPassword(userId, transactionPassword) {
        let user = this.mockUsers.find(u => u.registerId === userId);
        if (_.isEmpty(user)) {
            user = this.mockUsers.find(u => u._id === userId);
        }
        if (_.isEmpty(user)) {
            user = this.mockUsers.find(u => u.emailId === userId);
        }
        return user && user.transactionPassword === transactionPassword;
    }
    checkUserBalance(userId, balanceType, amount) {
        let user = this.mockUsers.find(u => u.registerId === userId);
        if (_.isEmpty(user)) {
            user = this.mockUsers.find(u => u._id === userId);
        }
        if (_.isEmpty(user)) {
            user = this.mockUsers.find(u => u.emailId === userId);
        }
        if (!user)
            return false;
        const balance = user[balanceType] || 0;
        return balance >= amount;
    }
    async getDropdownValuesForFunds(userId) {
        try {
            let user = this.mockUsers.find(u => u.registerId === userId);
            if (_.isEmpty(user)) {
                user = this.mockUsers.find(u => u._id === userId);
            }
            if (_.isEmpty(user)) {
                user = this.mockUsers.find(u => u.emailId === userId);
            }
            if (_.isEmpty(user)) {
                throw new common_1.BadRequestException('User details not found');
            }
            const userDetails = {
                sponserCommission: user.sponserCommission || 0,
                aurCommission: user.aurCommission || 0,
                gameCommission: user.gameCommission || 0,
                funds: user.funds || 0,
                prtCommission: user.prtCommission || 0,
            };
            return {
                status: 1,
                message: 'User details are: ',
                data: userDetails,
            };
        }
        catch (error) {
            console.error('Error fetching user details:', error);
            throw new common_1.BadRequestException('Failed to get user details');
        }
    }
    async fundTransfer(userId, fundTransferDto) {
        try {
            const { registerId, amount, type, transactionPassword } = fundTransferDto;
            const isPasswordValid = this.verifyTransactionPassword(userId, transactionPassword);
            if (!isPasswordValid) {
                throw new common_1.BadRequestException('Invalid transaction password');
            }
            let senderUser = this.mockUsers.find(u => u.registerId === userId);
            if (_.isEmpty(senderUser)) {
                senderUser = this.mockUsers.find(u => u._id === userId);
            }
            if (_.isEmpty(senderUser)) {
                senderUser = this.mockUsers.find(u => u.emailId === userId);
            }
            if (!senderUser || senderUser.isDeleted || !senderUser.status) {
                throw new common_1.BadRequestException('User not found or inactive');
            }
            const receiverUser = this.mockUsers.find(u => u.registerId === registerId);
            if (!receiverUser || receiverUser.isDeleted || !receiverUser.status) {
                throw new common_1.BadRequestException('Receiver user not found or inactive');
            }
            if (senderUser.registerId === registerId) {
                throw new common_1.BadRequestException('Cannot transfer funds to the same registerId.');
            }
            const balanceKey = this.getBalanceKey(type);
            if (!balanceKey) {
                throw new common_1.BadRequestException('Invalid fund type');
            }
            const hasSufficientBalance = this.checkUserBalance(userId, balanceKey, amount);
            if (!hasSufficientBalance) {
                throw new common_1.BadRequestException(`There is no sufficient amount in ${type}`);
            }
            const transactionNo = await this.generateTransactionNo();
            const newFund = new this.fundsModel({
                userId: new mongoose_2.Types.ObjectId(senderUser._id),
                receiverUserId: new mongoose_2.Types.ObjectId(receiverUser._id),
                type,
                amount,
                transactionNo,
                status: funds_schema_1.FundStatus.SUCCESS,
            });
            const savedFund = await newFund.save();
            if (!savedFund) {
                throw new common_1.BadRequestException('Failed to create fund transfer record');
            }
            return {
                status: 1,
                message: 'Funds sent successfully',
                data: {
                    transactionNo: savedFund.transactionNo,
                    amount: savedFund.amount,
                    receiverName: receiverUser.fullName,
                    receiverRegisterId: receiverUser.registerId,
                },
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error('Fund transfer error:', error);
            throw new common_1.BadRequestException('Internal server error');
        }
    }
    getBalanceKey(type) {
        const balanceKeys = {
            [funds_schema_1.FundType.SPONSOR_COMMISSION]: 'sponserCommission',
            [funds_schema_1.FundType.AUR_COMMISSION]: 'aurCommission',
            [funds_schema_1.FundType.GAME_COMMISSION]: 'gameCommission',
            [funds_schema_1.FundType.PRT_COMMISSION]: 'prtCommission',
        };
        return balanceKeys[type] || null;
    }
    async getAllFundRecordsByUserId(userId) {
        try {
            let user = this.mockUsers.find(u => u.registerId === userId);
            if (_.isEmpty(user)) {
                user = this.mockUsers.find(u => u._id === userId);
            }
            if (_.isEmpty(user)) {
                user = this.mockUsers.find(u => u.emailId === userId);
            }
            if (_.isEmpty(user)) {
                throw new common_1.BadRequestException('User not found');
            }
            const userObjectId = new mongoose_2.Types.ObjectId(user._id);
            const records = await this.fundsModel.find({
                $or: [
                    { userId: userObjectId },
                    { receiverUserId: userObjectId }
                ]
            }).sort({ createdAt: -1 });
            return {
                status: 1,
                message: 'Fund records retrieved successfully',
                data: records,
                total: records.length
            };
        }
        catch (error) {
            console.error('Error fetching fund records:', error);
            throw new common_1.BadRequestException('Failed to fetch fund records');
        }
    }
    async getFundRecordByTransactionNo(transactionNo) {
        try {
            const record = await this.fundsModel.findOne({ transactionNo });
            if (!record) {
                throw new common_1.NotFoundException('Transaction not found');
            }
            return {
                status: 1,
                message: 'Fund record retrieved successfully',
                data: record
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            console.error('Error fetching fund record:', error);
            throw new common_1.BadRequestException('Failed to fetch fund record');
        }
    }
    async getFundStatisticsByUserId(userId) {
        try {
            let user = this.mockUsers.find(u => u.registerId === userId);
            if (_.isEmpty(user)) {
                user = this.mockUsers.find(u => u._id === userId);
            }
            if (_.isEmpty(user)) {
                user = this.mockUsers.find(u => u.emailId === userId);
            }
            if (_.isEmpty(user)) {
                throw new common_1.BadRequestException('User not found');
            }
            const userObjectId = new mongoose_2.Types.ObjectId(user._id);
            const sentStats = await this.fundsModel.aggregate([
                { $match: { userId: userObjectId } },
                {
                    $group: {
                        _id: null,
                        totalSent: { $sum: '$amount' },
                        totalSentTransactions: { $sum: 1 },
                        successSent: {
                            $sum: {
                                $cond: [{ $eq: ['$status', 'Success'] }, 1, 0]
                            }
                        },
                        failedSent: {
                            $sum: {
                                $cond: [{ $eq: ['$status', 'Failed'] }, 1, 0]
                            }
                        },
                        pendingSent: {
                            $sum: {
                                $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0]
                            }
                        }
                    }
                }
            ]);
            const receivedStats = await this.fundsModel.aggregate([
                { $match: { receiverUserId: userObjectId } },
                {
                    $group: {
                        _id: null,
                        totalReceived: { $sum: '$amount' },
                        totalReceivedTransactions: { $sum: 1 },
                        successReceived: {
                            $sum: {
                                $cond: [{ $eq: ['$status', 'Success'] }, 1, 0]
                            }
                        },
                        failedReceived: {
                            $sum: {
                                $cond: [{ $eq: ['$status', 'Failed'] }, 1, 0]
                            }
                        },
                        pendingReceived: {
                            $sum: {
                                $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0]
                            }
                        }
                    }
                }
            ]);
            const sentData = sentStats[0] || {
                totalSent: 0,
                totalSentTransactions: 0,
                successSent: 0,
                failedSent: 0,
                pendingSent: 0
            };
            const receivedData = receivedStats[0] || {
                totalReceived: 0,
                totalReceivedTransactions: 0,
                successReceived: 0,
                failedReceived: 0,
                pendingReceived: 0
            };
            return {
                status: 1,
                message: 'Fund statistics retrieved successfully',
                data: {
                    sent: sentData,
                    received: receivedData,
                    netAmount: receivedData.totalReceived - sentData.totalSent
                }
            };
        }
        catch (error) {
            console.error('Error fetching fund statistics:', error);
            throw new common_1.BadRequestException('Failed to fetch fund statistics');
        }
    }
    async fundsTransferHistoryListing(userId, historyDto) {
        try {
            const { page = 1, pagesize = 10, startDate, endDate, searchText, sort = { _id: -1 } } = historyDto;
            const skip = (page - 1) * pagesize;
            let user = this.mockUsers.find(u => u.registerId === userId);
            if (_.isEmpty(user)) {
                user = this.mockUsers.find(u => u._id === userId);
            }
            if (_.isEmpty(user)) {
                user = this.mockUsers.find(u => u.emailId === userId);
            }
            if (_.isEmpty(user)) {
                throw new common_1.BadRequestException('User not found');
            }
            const query = { userId: new mongoose_2.Types.ObjectId(user._id) };
            if (startDate || endDate) {
                query.createdAt = {};
                if (startDate) {
                    query.createdAt.$gte = new Date(startDate);
                }
                if (endDate) {
                    query.createdAt.$lte = new Date(endDate + 'T23:59:59.999Z');
                }
            }
            if (searchText) {
                const regex = new RegExp(searchText, 'i');
                query.$or = [
                    { type: regex },
                    { transactionNo: regex },
                ];
            }
            const result = await this.fundsModel.aggregate([
                { $match: query },
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
                { $sort: sort },
                { $skip: skip },
                { $limit: pagesize },
            ]);
            const total = await this.fundsModel.aggregate([
                { $match: query },
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
            ]);
            return {
                status: 1,
                data: result,
                page,
                pagesize,
                total: total.length,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Internal server error');
        }
    }
    async fundsReceivedHistoryListing(userId, historyDto) {
        try {
            const { page = 1, pagesize = 10, startDate, endDate, searchText, sort = { _id: -1 } } = historyDto;
            const skip = (page - 1) * pagesize;
            let user = this.mockUsers.find(u => u.registerId === userId);
            if (_.isEmpty(user)) {
                user = this.mockUsers.find(u => u._id === userId);
            }
            if (_.isEmpty(user)) {
                user = this.mockUsers.find(u => u.emailId === userId);
            }
            if (_.isEmpty(user)) {
                throw new common_1.BadRequestException('User not found');
            }
            const query = { receiverUserId: new mongoose_2.Types.ObjectId(user._id) };
            if (startDate || endDate) {
                query.createdAt = {};
                if (startDate) {
                    query.createdAt.$gte = new Date(startDate);
                }
                if (endDate) {
                    query.createdAt.$lte = new Date(endDate + 'T23:59:59.999Z');
                }
            }
            if (searchText) {
                const regex = new RegExp(searchText, 'i');
                query.$or = [
                    { type: regex },
                    { transactionNo: regex },
                ];
            }
            const result = await this.fundsModel.aggregate([
                { $match: query },
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
                { $sort: sort },
                { $skip: skip },
                { $limit: pagesize },
            ]);
            const total = await this.fundsModel.aggregate([
                { $match: query },
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
            ]);
            return {
                status: 1,
                data: result,
                page,
                pagesize,
                total: total.length,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Internal server error');
        }
    }
};
exports.FundsService = FundsService;
exports.FundsService = FundsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Funds')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FundsService);
//# sourceMappingURL=funds.service.js.map
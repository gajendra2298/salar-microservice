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
    async saveTransferHistory(transferData) {
        try {
            const newTransferHistory = new this.fundsModel({
                senderUserId: transferData.senderUserId,
                receiverUserId: transferData.receiverUserId,
                receiverCustomerRegisteredId: transferData.receiverCustomerRegisteredId,
                customerName: transferData.customerName,
                commissionType: transferData.commissionType,
                amount: transferData.amount,
                adminCharges: transferData.adminCharges,
                netPayable: transferData.netPayable,
                fundsTransactionNo: transferData.fundsTransactionNo,
                status: transferData.status,
                failureReason: transferData.failureReason,
                transferDate: new Date()
            });
            const savedHistory = await newTransferHistory.save();
            return {
                success: true,
                message: 'Transfer history saved successfully',
                data: {
                    serialNo: savedHistory.serialNo,
                    transferDate: savedHistory.transferDate,
                    receiverCustomerRegisteredId: savedHistory.receiverCustomerRegisteredId,
                    customerName: savedHistory.customerName,
                    fundsTransactionNo: savedHistory.fundsTransactionNo,
                    status: savedHistory.status
                }
            };
        }
        catch (error) {
            throw new common_1.HttpException('Error saving transfer history', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getTransferHistory(userId, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            let query = {};
            if (userId) {
                query = {
                    $or: [
                        { senderUserId: userId },
                        { receiverUserId: userId }
                    ]
                };
            }
            const transferHistory = await this.fundsModel
                .find(query)
                .sort({ transferDate: -1, serialNo: -1 })
                .skip(skip)
                .limit(limit)
                .select('serialNo transferDate receiverCustomerRegisteredId customerName fundsTransactionNo status');
            const totalCount = await this.fundsModel.countDocuments(query);
            const formattedHistory = transferHistory.map(record => ({
                serialNo: record.serialNo,
                date: record.transferDate.toLocaleDateString(),
                receiverCustomerRegisteredId: record.receiverCustomerRegisteredId,
                customerName: record.customerName,
                fundsTransactionNo: record.fundsTransactionNo,
                status: record.status
            }));
            return {
                success: true,
                message: 'Transfer history retrieved successfully',
                data: {
                    history: formattedHistory,
                    pagination: {
                        currentPage: page,
                        totalPages: Math.ceil(totalCount / limit),
                        totalRecords: totalCount,
                        recordsPerPage: limit
                    }
                }
            };
        }
        catch (error) {
            throw new common_1.HttpException('Error retrieving transfer history', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
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
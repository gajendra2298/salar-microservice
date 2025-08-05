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
exports.FundsTransferService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const funds_schema_1 = require("./schemas/funds.schema");
const app_config_1 = require("../config/app.config");
const axios_1 = require("axios");
const core_1 = require("@nestjs/core");
let FundsTransferService = class FundsTransferService {
    constructor(fundsModel, request) {
        this.fundsModel = fundsModel;
        this.request = request;
    }
    async getDropdownValuesForFunds() {
        try {
            const userId = this.extractUserIdFromRequest();
            if (!userId) {
                return { status: 0, message: 'User ID not found in request' };
            }
            const userDetails = await this.getUserDetails(userId);
            if (!userDetails) {
                return { status: 0, message: 'User details not found' };
            }
            return {
                status: 1,
                message: 'User details are: ',
                data: {
                    sponserCommission: userDetails.sponserCommission || 0,
                    aurCommission: userDetails.aurCommission || 0,
                    gameCommission: userDetails.gameCommission || 0,
                    funds: userDetails.funds || 0
                }
            };
        }
        catch (error) {
            console.log(`error: ${error}`);
            return { status: 0, message: 'Internal server error' };
        }
    }
    async fundTransfer(data) {
        try {
            const userId = this.extractUserIdFromRequest();
            if (!userId) {
                return { status: 0, message: 'User ID not found in request' };
            }
            data.userId = userId;
            const fieldsArray = ['registerId', 'amount', 'type', 'transactionPassword'];
            const emptyFields = this.checkEmptyFields(data, fieldsArray);
            if (emptyFields.length > 0) {
                return { status: 0, message: 'Please send ' + emptyFields.toString() + ' fields required.' };
            }
            const user = await this.getUserDetails(userId);
            if (!user) {
                return { status: 0, message: 'User Not Found' };
            }
            const isPasswordValid = await this.verifyTransactionPassword(data.transactionPassword, user.transactionPassword);
            if (!isPasswordValid) {
                return { status: 0, message: 'Invalid transaction password' };
            }
            const userDetails = await this.getUserByRegisterId(data.registerId);
            if (!userDetails) {
                return { status: 0, message: 'User details not found' };
            }
            if (user.registerId === data.registerId) {
                return { status: 0, message: 'Cannot transfer funds to the same registerId.' };
            }
            data.receiverUserId = userDetails._id;
            const key = this.getCommissionKey(data.type);
            if (!key) {
                return { status: 0, message: 'Please send proper type' };
            }
            if (key !== 'prtCommission') {
                const hasSufficientBalance = await this.validateSufficientBalance(userId, key, data.amount);
                if (!hasSufficientBalance) {
                    return { status: 0, message: `There is no sufficient amount in ${data.type}` };
                }
            }
            const transactionNo = await this.generateTransactionNo();
            data.transactionNo = transactionNo;
            data.status = 'Pending';
            const newFund = await this.fundsModel.create(data);
            if (!newFund) {
                return { status: 0, message: 'Failed to send funds' };
            }
            if (key !== 'prtCommission') {
                await this.updateUserCommission(userId, key, -data.amount);
                await this.updateUserFunds(userDetails._id, data.amount);
            }
            else {
                await this.createPRTCommissionRecord(user.registerId, data.amount);
            }
            await this.updateUserMetrics(userId, key, data.amount, 'deduct');
            await this.updateUserMetrics(userDetails._id, key, data.amount, 'add');
            await this.fundsModel.findByIdAndUpdate(newFund._id, { status: 'Success' }, { new: true });
            await this.saveTransferHistory({
                senderUserId: userId,
                receiverUserId: userDetails._id,
                receiverCustomerRegisteredId: data.registerId,
                customerName: userDetails.fullName || 'Unknown Customer',
                commissionType: data.type,
                amount: data.amount,
                adminCharges: 0,
                netPayable: data.amount,
                fundsTransactionNo: transactionNo,
                status: 'Success'
            });
            return { status: 1, message: 'Funds sent successfully' };
        }
        catch (error) {
            console.log('error- ', error);
            return { status: 0, message: error.message || 'Internal server error' };
        }
    }
    async fundsTransferHistoryListing(data) {
        try {
            const userId = this.extractUserIdFromRequest();
            if (!userId) {
                return { status: 0, message: 'User ID not found in request' };
            }
            const skip = (parseInt(data.page) - 1) * parseInt(data.pagesize);
            const sort = data.sort ? data.sort : { _id: -1 };
            const limit = data.pagesize;
            let queryConditions = { userId: userId };
            if (data.startDate || data.endDate) {
                queryConditions.createdAt = {};
                if (data.startDate) {
                    queryConditions.createdAt.$gte = new Date(data.startDate);
                }
                if (data.endDate) {
                    queryConditions.createdAt.$lte = new Date(data.endDate);
                }
            }
            if (data.searchText) {
                const regex = new RegExp(data.searchText, 'i');
                queryConditions.$or = [
                    { type: regex },
                    { transactionNo: regex }
                ];
            }
            const result = await this.fundsModel.aggregate([
                { $match: queryConditions },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'receiverUserId',
                        foreignField: '_id',
                        as: 'receiver'
                    }
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
                { $limit: limit },
            ]);
            const total = await this.fundsModel.aggregate([
                { $match: queryConditions },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'receiverUserId',
                        foreignField: '_id',
                        as: 'receiver'
                    }
                },
                { $unwind: { path: '$receiver', preserveNullAndEmptyArrays: true } },
                { $project: { _id: 1 } },
            ]);
            return {
                status: 1,
                data: result,
                page: data.page,
                pagesize: data.pagesize,
                total: total.length,
            };
        }
        catch (error) {
            console.log('error- ', error);
            return { status: 0, message: 'Internal server error' };
        }
    }
    async fundsReceivedHistoryListing(data) {
        try {
            const userId = this.extractUserIdFromRequest();
            if (!userId) {
                return { status: 0, message: 'User ID not found in request' };
            }
            const skip = (parseInt(data.page) - 1) * parseInt(data.pagesize);
            const sort = data.sort ? data.sort : { _id: -1 };
            const limit = data.pagesize;
            let queryConditions = { receiverUserId: userId };
            if (data.startDate || data.endDate) {
                queryConditions.createdAt = {};
                if (data.startDate) {
                    queryConditions.createdAt.$gte = new Date(data.startDate);
                }
                if (data.endDate) {
                    queryConditions.createdAt.$lte = new Date(data.endDate);
                }
            }
            if (data.searchText) {
                const regex = new RegExp(data.searchText, 'i');
                queryConditions.$or = [
                    { type: regex },
                    { transactionNo: regex }
                ];
            }
            const result = await this.fundsModel.aggregate([
                { $match: queryConditions },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'sender'
                    }
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
                { $limit: limit },
            ]);
            const total = await this.fundsModel.aggregate([
                { $match: queryConditions },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'sender'
                    }
                },
                { $unwind: { path: '$sender', preserveNullAndEmptyArrays: true } },
                { $project: { _id: 1 } },
            ]);
            return {
                status: 1,
                data: result,
                page: data.page,
                pagesize: data.pagesize,
                total: total.length,
            };
        }
        catch (error) {
            console.log('error- ', error);
            return { status: 0, message: 'Internal server error' };
        }
    }
    extractUserIdFromRequest() {
        try {
            const authHeader = this.request.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.substring(7);
                const decoded = this.decodeJwtToken(token);
                if (decoded && decoded.userId) {
                    return decoded.userId;
                }
            }
            const userIdHeader = this.request.headers['x-user-id'];
            if (userIdHeader) {
                return userIdHeader;
            }
            const bodyUserId = this.request.body?.userId;
            if (bodyUserId) {
                return bodyUserId;
            }
            const queryUserId = this.request.query.userId;
            if (queryUserId) {
                return queryUserId;
            }
            return null;
        }
        catch (error) {
            console.error('Error extracting user ID from request:', error);
            return null;
        }
    }
    decodeJwtToken(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        }
        catch (error) {
            console.error('Error decoding JWT token:', error);
            return null;
        }
    }
    async getUserDetails(userId) {
        try {
            const response = await axios_1.default.get(`${app_config_1.appConfig.services.user.url}/users/${userId}`, {
                timeout: app_config_1.appConfig.services.user.timeout,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.request.headers.authorization || ''
                }
            });
            return response.data;
        }
        catch (error) {
            console.error('Error fetching user details:', error);
            return null;
        }
    }
    async getUserByRegisterId(registerId) {
        try {
            const response = await axios_1.default.get(`${app_config_1.appConfig.services.user.url}/users/register/${registerId}`, {
                timeout: app_config_1.appConfig.services.user.timeout,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.request.headers.authorization || ''
                }
            });
            return response.data;
        }
        catch (error) {
            console.error('Error fetching user by register ID:', error);
            return null;
        }
    }
    async verifyTransactionPassword(inputPassword, savedPassword) {
        try {
            return inputPassword === savedPassword;
        }
        catch (error) {
            console.error('Error verifying transaction password:', error);
            return false;
        }
    }
    getCommissionKey(type) {
        const commissionMap = {
            'Sponser Commission': 'sponserCommission',
            'Aur Commission': 'aurCommission',
            'Game Commission': 'gameCommission',
            'PRT Commission': 'prtCommission'
        };
        return commissionMap[type] || null;
    }
    async validateSufficientBalance(userId, key, amount) {
        try {
            const userDetails = await this.getUserDetails(userId);
            if (!userDetails) {
                return false;
            }
            return userDetails[key] >= amount;
        }
        catch (error) {
            console.error('Error validating sufficient balance:', error);
            return false;
        }
    }
    async generateTransactionNo() {
        try {
            const fundsCount = await this.fundsModel.countDocuments();
            const randomGenerator = this.generateRandomString(8, 'capital');
            return 'F' + randomGenerator + (fundsCount + 1);
        }
        catch (error) {
            console.error('Error generating transaction number:', error);
            const timestamp = new Date().getTime();
            const random = Math.floor(Math.random() * 1000);
            return `F${timestamp}${random}`;
        }
    }
    generateRandomString(length, type) {
        const chars = type === 'capital' ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : 'abcdefghijklmnopqrstuvwxyz';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    async updateUserCommission(userId, key, amount) {
        try {
            const response = await axios_1.default.post(`${app_config_1.appConfig.services.user.url}/users/update-commission`, {
                userId: userId,
                commissionType: key,
                amount: amount,
                operation: amount > 0 ? 'add' : 'deduct'
            }, {
                timeout: app_config_1.appConfig.services.user.timeout,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.request.headers.authorization || ''
                }
            });
            return response.status === 200;
        }
        catch (error) {
            console.error('Error updating user commission:', error);
            return false;
        }
    }
    async updateUserFunds(userId, amount) {
        try {
            const response = await axios_1.default.post(`${app_config_1.appConfig.services.user.url}/users/update-funds`, {
                userId: userId,
                amount: amount,
                operation: 'add'
            }, {
                timeout: app_config_1.appConfig.services.user.timeout,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.request.headers.authorization || ''
                }
            });
            return response.status === 200;
        }
        catch (error) {
            console.error('Error updating user funds:', error);
            return false;
        }
    }
    async createPRTCommissionRecord(registerId, amount) {
        try {
            const response = await axios_1.default.post(`${app_config_1.appConfig.services.user.url}/users/prt-commission`, {
                registerId: registerId,
                prtCommission: amount,
                status: 'debited'
            }, {
                timeout: app_config_1.appConfig.services.user.timeout,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.request.headers.authorization || ''
                }
            });
            return response.status === 200;
        }
        catch (error) {
            console.error('Error creating PRT commission record:', error);
            return false;
        }
    }
    async updateUserMetrics(userId, key, amount, operation) {
        try {
            const response = await axios_1.default.post(`${app_config_1.appConfig.services.user.url}/users/metrics`, {
                userId: userId,
                commissionType: key,
                amount: amount,
                operation: operation
            }, {
                timeout: app_config_1.appConfig.services.user.timeout,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.request.headers.authorization || ''
                }
            });
            return response.status === 200;
        }
        catch (error) {
            console.error('Error updating user metrics:', error);
            return false;
        }
    }
    checkEmptyFields(data, fieldsArray) {
        const emptyFields = [];
        for (const field of fieldsArray) {
            if (!data[field] || data[field] === '') {
                emptyFields.push(field);
            }
        }
        return emptyFields;
    }
    async saveTransferHistory(historyData) {
        try {
            const historyServiceUrl = process.env.HISTORY_SERVICE_URL || 'http://localhost:3005';
            await axios_1.default.post(`${historyServiceUrl}/funds-transfer-history/save-transfer`, historyData, {
                timeout: 5000
            });
        }
        catch (error) {
            console.error('Error saving transfer history:', error.message);
        }
    }
};
exports.FundsTransferService = FundsTransferService;
exports.FundsTransferService = FundsTransferService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(funds_schema_1.Funds.name)),
    __param(1, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [mongoose_2.Model, Object])
], FundsTransferService);
//# sourceMappingURL=funds-transfer.service.js.map
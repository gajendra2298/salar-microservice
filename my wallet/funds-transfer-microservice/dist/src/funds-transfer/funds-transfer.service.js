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
const axios_1 = require("axios");
const funds_schema_1 = require("./schemas/funds.schema");
const app_config_1 = require("../config/app.config");
let FundsTransferService = class FundsTransferService {
    constructor(fundsModel) {
        this.fundsModel = fundsModel;
    }
    async getDropdownValuesForFunds(userId) {
        try {
            const response = await axios_1.default.get(`${app_config_1.appConfig.services.user.url}/api/users/${userId}/details`, {
                timeout: app_config_1.appConfig.services.user.timeout,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${app_config_1.appConfig.api.token}`
                }
            });
            if (response.status !== 200) {
                throw new common_1.HttpException('Failed to fetch user details', common_1.HttpStatus.BAD_REQUEST);
            }
            const userDetails = response.data;
            return {
                status: 1,
                message: 'User details fetched successfully',
                data: userDetails,
            };
        }
        catch (error) {
            console.error('Error getting dropdown values:', error);
            if (error instanceof axios_1.AxiosError) {
                if (error.code === 'ECONNREFUSED') {
                    throw new common_1.HttpException('User service is unavailable', common_1.HttpStatus.SERVICE_UNAVAILABLE);
                }
                if (error.response?.status === 404) {
                    throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
                }
                if (error.response?.status === 401) {
                    throw new common_1.HttpException('Unauthorized access to user service', common_1.HttpStatus.UNAUTHORIZED);
                }
                if (error.code === 'ETIMEDOUT') {
                    throw new common_1.HttpException('Request timeout - user service is slow', common_1.HttpStatus.REQUEST_TIMEOUT);
                }
            }
            throw new common_1.HttpException('Internal server error while fetching user details', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async fundTransfer(transferData) {
        try {
            const { userId, registerId, amount, type, transactionPassword } = transferData;
            if (!registerId || !amount || !type || !transactionPassword) {
                throw new common_1.HttpException('Please send all required fields', common_1.HttpStatus.BAD_REQUEST);
            }
            try {
                const authResponse = await axios_1.default.post(`${app_config_1.appConfig.services.auth.url}/api/auth/validate-password`, {
                    userId,
                    transactionPassword
                }, {
                    timeout: app_config_1.appConfig.services.auth.timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${app_config_1.appConfig.api.token}`
                    }
                });
                if (authResponse.data.valid !== true) {
                    throw new common_1.HttpException('Invalid transaction password', common_1.HttpStatus.UNAUTHORIZED);
                }
            }
            catch (authError) {
                if (authError instanceof axios_1.AxiosError) {
                    if (authError.response?.status === 401) {
                        throw new common_1.HttpException('Invalid transaction password', common_1.HttpStatus.UNAUTHORIZED);
                    }
                    if (authError.code === 'ECONNREFUSED') {
                        throw new common_1.HttpException('Authentication service unavailable', common_1.HttpStatus.SERVICE_UNAVAILABLE);
                    }
                }
                throw new common_1.HttpException('Authentication service error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            try {
                const userResponse = await axios_1.default.get(`${app_config_1.appConfig.services.user.url}/api/users/${registerId}`, {
                    timeout: app_config_1.appConfig.services.user.timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${app_config_1.appConfig.api.token}`
                    }
                });
                if (userResponse.data.userId === userId) {
                    throw new common_1.HttpException('Cannot transfer funds to the same user', common_1.HttpStatus.BAD_REQUEST);
                }
            }
            catch (userError) {
                if (userError instanceof axios_1.AxiosError) {
                    if (userError.response?.status === 404) {
                        throw new common_1.HttpException('Receiver user not found', common_1.HttpStatus.NOT_FOUND);
                    }
                    if (userError.code === 'ECONNREFUSED') {
                        throw new common_1.HttpException('User service unavailable', common_1.HttpStatus.SERVICE_UNAVAILABLE);
                    }
                }
                throw userError;
            }
            let userBalance;
            try {
                const balanceResponse = await axios_1.default.get(`${app_config_1.appConfig.services.balance.url}/api/balance/${userId}/${type}`, {
                    timeout: app_config_1.appConfig.services.balance.timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${app_config_1.appConfig.api.token}`
                    }
                });
                userBalance = balanceResponse.data.balance;
            }
            catch (balanceError) {
                if (balanceError instanceof axios_1.AxiosError) {
                    if (balanceError.code === 'ECONNREFUSED') {
                        throw new common_1.HttpException('Balance service unavailable', common_1.HttpStatus.SERVICE_UNAVAILABLE);
                    }
                }
                throw new common_1.HttpException('Failed to fetch user balance', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            if (userBalance < amount) {
                throw new common_1.HttpException(`Insufficient balance in ${type}. Available: ${userBalance}, Required: ${amount}`, common_1.HttpStatus.BAD_REQUEST);
            }
            const fundsCount = await this.fundsModel.countDocuments();
            const randomGenerator = this.generateRandomString(8);
            const transactionNo = 'F' + randomGenerator + (fundsCount + 1);
            const adminCharges = amount * 0.02;
            const netPayable = amount - adminCharges;
            const newFund = await this.fundsModel.create({
                userId,
                receiverUserId: registerId,
                type,
                amount,
                transactionNo,
                status: 'Success',
                adminCharges,
                netPayable,
            });
            if (!newFund) {
                throw new common_1.HttpException('Failed to create transfer record', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            try {
                await axios_1.default.post(`${app_config_1.appConfig.services.balance.url}/api/balance/transfer`, {
                    senderId: userId,
                    receiverId: registerId,
                    amount: netPayable,
                    type,
                    transactionNo: newFund.transactionNo
                }, {
                    timeout: app_config_1.appConfig.services.user.timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${app_config_1.appConfig.api.token}`
                    }
                });
            }
            catch (balanceUpdateError) {
                console.error('Failed to update balances:', balanceUpdateError);
            }
            return {
                status: 1,
                message: 'Funds transferred successfully',
                data: {
                    transactionNo: newFund.transactionNo,
                    amount: newFund.amount,
                    netPayable: newFund.netPayable,
                    adminCharges: newFund.adminCharges,
                    receiverId: registerId,
                    type: newFund.type,
                    status: newFund.status,
                },
            };
        }
        catch (error) {
            console.error('Error in fund transfer:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Internal server error during fund transfer', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
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
exports.FundsTransferService = FundsTransferService;
exports.FundsTransferService = FundsTransferService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(funds_schema_1.Funds.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FundsTransferService);
//# sourceMappingURL=funds-transfer.service.js.map
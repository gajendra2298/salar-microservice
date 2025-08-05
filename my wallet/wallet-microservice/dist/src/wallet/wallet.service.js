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
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const wallet_schema_1 = require("./schemas/wallet.schema");
let WalletService = class WalletService {
    constructor(walletModel) {
        this.walletModel = walletModel;
    }
    async getWalletBalance(userId) {
        try {
            let wallet = await this.walletModel.findOne({ userId }).exec();
            if (!wallet) {
                wallet = await this.walletModel.create({ userId });
            }
            const availableBalance = wallet.referralComm +
                wallet.sponsorComm +
                wallet.ausComm +
                wallet.productTeamReferralCommission +
                wallet.novaReferralCommission +
                wallet.royaltyReferralTeamCommission +
                wallet.shoppingAmount +
                wallet.salarCoins +
                wallet.royaltyCredits +
                wallet.salarGiftCredits +
                wallet.funds;
            wallet.availableBalance = availableBalance;
            await wallet.save();
            return {
                status: 1,
                message: 'Wallet balance retrieved successfully',
                data: {
                    referralComm: wallet.referralComm,
                    sponsorComm: wallet.sponsorComm,
                    ausComm: wallet.ausComm,
                    productTeamReferralCommission: wallet.productTeamReferralCommission,
                    novaReferralCommission: wallet.novaReferralCommission,
                    royaltyReferralTeamCommission: wallet.royaltyReferralTeamCommission,
                    shoppingAmount: wallet.shoppingAmount,
                    salarCoins: wallet.salarCoins,
                    royaltyCredits: wallet.royaltyCredits,
                    salarGiftCredits: wallet.salarGiftCredits,
                    funds: wallet.funds,
                    availableBalance: wallet.availableBalance,
                },
            };
        }
        catch (error) {
            console.error('Error getting wallet balance:', error);
            return {
                status: 0,
                message: 'Failed to get wallet balance',
            };
        }
    }
    async updateWalletBalance(userId, updates) {
        try {
            const wallet = await this.walletModel.findOneAndUpdate({ userId }, { $inc: updates }, { new: true, upsert: true });
            const availableBalance = wallet.referralComm +
                wallet.sponsorComm +
                wallet.ausComm +
                wallet.productTeamReferralCommission +
                wallet.novaReferralCommission +
                wallet.royaltyReferralTeamCommission +
                wallet.shoppingAmount +
                wallet.salarCoins +
                wallet.royaltyCredits +
                wallet.salarGiftCredits +
                wallet.funds;
            wallet.availableBalance = availableBalance;
            await wallet.save();
            return {
                status: 1,
                message: 'Wallet balance updated successfully',
                data: wallet,
            };
        }
        catch (error) {
            console.error('Error updating wallet balance:', error);
            return {
                status: 0,
                message: 'Failed to update wallet balance',
            };
        }
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(wallet_schema_1.Wallet.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], WalletService);
//# sourceMappingURL=wallet.service.js.map
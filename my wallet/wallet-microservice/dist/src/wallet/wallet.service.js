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
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const wallet_schema_1 = require("./schemas/wallet.schema");
const mockUserData = __importStar(require("./mock-data/user-details.mock.json"));
const _ = __importStar(require("lodash"));
let WalletService = class WalletService {
    constructor(walletModel) {
        this.walletModel = walletModel;
        this.mockUsers = mockUserData.users;
    }
    async getWalletBalance(userId) {
        try {
            let user = this.mockUsers.find(u => u.registerId === userId);
            if (_.isEmpty(user)) {
                user = this.mockUsers.find(u => u._id === userId);
            }
            if (_.isEmpty(user)) {
                user = this.mockUsers.find(u => u.emailId === userId);
            }
            if (_.isEmpty(user)) {
                return {
                    status: 0,
                    message: 'User not found',
                };
            }
            let wallet = await this.walletModel.findOne({ userId: new mongoose_2.Types.ObjectId(user._id) }).exec();
            if (!wallet) {
                wallet = await this.walletModel.create({
                    userId: new mongoose_2.Types.ObjectId(user._id),
                    referralComm: user.referralComm || 0,
                    sponsorComm: user.sponsorComm || 0,
                    ausComm: user.ausComm || 0,
                    productTeamReferralCommission: user.productTeamReferralCommission || 0,
                    novaReferralCommission: user.novaReferralCommission || 0,
                    royaltyReferralTeamCommission: user.royaltyReferralTeamCommission || 0,
                    shoppingAmount: user.shoppingAmount || 0,
                    salarCoins: user.salarCoins || 0,
                    royaltyCredits: user.royaltyCredits || 0,
                    salarGiftCredits: user.salarGiftCredits || 0,
                    funds: user.funds || 0,
                });
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
                    userId: user._id,
                    fullName: user.fullName,
                    emailId: user.emailId,
                    registerId: user.registerId,
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
            let user = this.mockUsers.find(u => u.registerId === userId);
            if (_.isEmpty(user)) {
                user = this.mockUsers.find(u => u._id === userId);
            }
            if (_.isEmpty(user)) {
                user = this.mockUsers.find(u => u.emailId === userId);
            }
            if (_.isEmpty(user)) {
                return {
                    status: 0,
                    message: 'User not found',
                };
            }
            const wallet = await this.walletModel.findOneAndUpdate({ userId: new mongoose_2.Types.ObjectId(user._id) }, { $inc: updates }, { new: true, upsert: true });
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
                data: {
                    userId: user._id,
                    fullName: user.fullName,
                    emailId: user.emailId,
                    registerId: user.registerId,
                    ...wallet.toObject(),
                },
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
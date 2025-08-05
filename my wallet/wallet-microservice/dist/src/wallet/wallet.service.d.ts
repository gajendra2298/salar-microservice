import { Model } from 'mongoose';
import { Wallet, WalletDocument } from './schemas/wallet.schema';
export declare class WalletService {
    private walletModel;
    constructor(walletModel: Model<WalletDocument>);
    getWalletBalance(userId: string): Promise<{
        status: number;
        message: string;
        data: {
            referralComm: number;
            sponsorComm: number;
            ausComm: number;
            productTeamReferralCommission: number;
            novaReferralCommission: number;
            royaltyReferralTeamCommission: number;
            shoppingAmount: number;
            salarCoins: number;
            royaltyCredits: number;
            salarGiftCredits: number;
            funds: number;
            availableBalance: number;
        };
    } | {
        status: number;
        message: string;
        data?: undefined;
    }>;
    updateWalletBalance(userId: string, updates: Partial<Wallet>): Promise<{
        status: number;
        message: string;
        data: import("mongoose").Document<unknown, {}, WalletDocument> & Wallet & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        };
    } | {
        status: number;
        message: string;
        data?: undefined;
    }>;
}

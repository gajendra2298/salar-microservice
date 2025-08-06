import { Model, Types } from 'mongoose';
import { Wallet, WalletDocument } from './schemas/wallet.schema';
export declare class WalletService {
    private walletModel;
    private mockUsers;
    constructor(walletModel: Model<WalletDocument>);
    getWalletBalance(userId: string): Promise<{
        status: number;
        message: string;
        data?: undefined;
    } | {
        status: number;
        message: string;
        data: {
            userId: string;
            fullName: string;
            emailId: string;
            registerId: string;
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
    }>;
    updateWalletBalance(userId: string, updates: Partial<Wallet>): Promise<{
        status: number;
        message: string;
        data?: undefined;
    } | {
        status: number;
        message: string;
        data: {
            userId: Types.ObjectId;
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
            _id: any;
            __v?: any;
            $locals: Record<string, unknown>;
            $op: "save" | "validate" | "remove" | null;
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: import("mongoose").Collection;
            db: import("mongoose").Connection;
            errors?: import("mongoose").Error.ValidationError;
            id?: any;
            isNew: boolean;
            schema: import("mongoose").Schema;
            fullName: string;
            emailId: string;
            registerId: string;
        };
    }>;
}

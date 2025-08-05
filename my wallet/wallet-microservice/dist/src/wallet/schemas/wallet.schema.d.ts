import { Document, Types } from 'mongoose';
export type WalletDocument = Wallet & Document;
export declare class Wallet {
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
}
export declare const WalletSchema: import("mongoose").Schema<Wallet, import("mongoose").Model<Wallet, any, any, any, Document<unknown, any, Wallet> & Wallet & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Wallet, Document<unknown, {}, import("mongoose").FlatRecord<Wallet>> & import("mongoose").FlatRecord<Wallet> & {
    _id: Types.ObjectId;
}>;

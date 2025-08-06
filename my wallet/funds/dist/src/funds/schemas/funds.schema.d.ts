import { Document, Types } from 'mongoose';
export type FundsDocument = Funds & Document;
export declare enum FundType {
    SPONSOR_COMMISSION = "Sponser Commission",
    AUR_COMMISSION = "Aur Commission",
    GAME_COMMISSION = "Game Commission",
    FUNDS = "Funds",
    PRT_COMMISSION = "PRT Commission"
}
export declare enum FundStatus {
    PENDING = "Pending",
    FAILED = "Failed",
    SUCCESS = "Success"
}
export declare class Funds {
    userId: Types.ObjectId;
    receiverUserId: string;
    type: FundType;
    amount: number;
    transactionNo: string;
    status: FundStatus;
}
export declare const FundsSchema: import("mongoose").Schema<Funds, import("mongoose").Model<Funds, any, any, any, Document<unknown, any, Funds> & Funds & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Funds, Document<unknown, {}, import("mongoose").FlatRecord<Funds>> & import("mongoose").FlatRecord<Funds> & {
    _id: Types.ObjectId;
}>;

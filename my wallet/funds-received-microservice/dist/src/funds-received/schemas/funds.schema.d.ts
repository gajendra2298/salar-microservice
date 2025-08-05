import { Document, Types } from 'mongoose';
export type FundsDocument = Funds & Document;
export declare class Funds {
    userId: Types.ObjectId;
    receiverUserId: Types.ObjectId;
    type: string;
    amount: number;
    transactionNo: string;
    status: string;
}
export declare const FundsSchema: import("mongoose").Schema<Funds, import("mongoose").Model<Funds, any, any, any, Document<unknown, any, Funds> & Funds & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Funds, Document<unknown, {}, import("mongoose").FlatRecord<Funds>> & import("mongoose").FlatRecord<Funds> & {
    _id: Types.ObjectId;
}>;

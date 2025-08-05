import { Document, Types } from 'mongoose';
export type CreditDebitDocument = CreditDebit & Document;
export declare class CreditDebit {
    userId: Types.ObjectId;
    reason: string;
    orderId: string;
    status: string;
    type: string;
    amount: number;
    transactionNo: string;
}
export declare const CreditDebitSchema: import("mongoose").Schema<CreditDebit, import("mongoose").Model<CreditDebit, any, any, any, Document<unknown, any, CreditDebit> & CreditDebit & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CreditDebit, Document<unknown, {}, import("mongoose").FlatRecord<CreditDebit>> & import("mongoose").FlatRecord<CreditDebit> & {
    _id: Types.ObjectId;
}>;

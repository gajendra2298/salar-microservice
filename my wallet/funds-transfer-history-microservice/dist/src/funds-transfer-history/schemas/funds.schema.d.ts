import { Document, Types } from 'mongoose';
export type FundsDocument = Funds & Document;
export declare class Funds {
    serialNo: number;
    transferDate: Date;
    receiverCustomerRegisteredId: string;
    customerName: string;
    fundsTransactionNo: string;
    status: string;
    senderUserId: Types.ObjectId;
    receiverUserId: Types.ObjectId;
    commissionType: string;
    amount: number;
    adminCharges: number;
    netPayable: number;
    failureReason: string;
}
export declare const FundsSchema: import("mongoose").Schema<Funds, import("mongoose").Model<Funds, any, any, any, Document<unknown, any, Funds> & Funds & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Funds, Document<unknown, {}, import("mongoose").FlatRecord<Funds>> & import("mongoose").FlatRecord<Funds> & {
    _id: Types.ObjectId;
}>;

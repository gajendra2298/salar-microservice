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
export declare const CreditDebitSchema: any;
